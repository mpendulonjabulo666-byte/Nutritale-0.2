"""Generates the Postman v2.1 collections and the local environment in this folder.

Run from the repository root: python3 docs/postman/generate_collections.py
Edit this file, not the JSON, then run it again.
"""
import json
import uuid
from pathlib import Path

OUT = Path(__file__).resolve().parent
OUT.mkdir(parents=True, exist_ok=True)
SCHEMA = "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"

# Runs after every request in a collection: the one error shape, no leaks, request id header.
COMMON_TESTS = r"""
pm.test('X-Request-Id header is present', function () {
  pm.expect(pm.response.headers.get('X-Request-Id')).to.match(/^[0-9a-f-]{36}$/);
});
if (pm.response.code >= 400) {
  pm.test('error body is exactly { error: { code, message } }', function () {
    const body = pm.response.json();
    pm.expect(Object.keys(body)).to.eql(['error']);
    pm.expect(Object.keys(body.error).sort()).to.eql(['code', 'message']);
    pm.expect(body.error.code).to.be.a('string');
    pm.expect(body.error.message).to.be.a('string');
  });
  pm.test('error body leaks nothing (no stack, library or database text)', function () {
    pm.expect(pm.response.text()).to.not.match(/stack|node_modules|\.ts:|\.js:|Mongo|ZodError|argon|jose|passwordHash/i);
  });
}
pm.test('response never contains a password hash', function () {
  pm.expect(pm.response.text()).to.not.match(/passwordHash|\$argon2/);
});
""".strip()

# Malformed but well-formed-looking tokens. Not signed with any real secret.
B64_HEADER = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
B64_PAYLOAD = "eyJzdWIiOiJzb21lb25lIiwic2lkIjoieCIsImlzcyI6Im51dHJpdGFsZS1hcGkiLCJhdWQiOiJudXRyaXRhbGUtYXBwIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjQxMDAwMDAwMDB9"
BAD_SIG_TOKEN = f"{B64_HEADER}.{B64_PAYLOAD}.c2lnbmVkLXdpdGgtYS13cm9uZy1zZWNyZXQtbm90LXJlYWw"
ALG_NONE_TOKEN = f"eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.{B64_PAYLOAD}.x"


def tests(*lines):
    return {"listen": "test", "script": {"type": "text/javascript", "exec": "\n".join(lines).split("\n")}}


def prereq(*lines):
    return {"listen": "prerequest", "script": {"type": "text/javascript", "exec": "\n".join(lines).split("\n")}}


def status_test(code, error_code=None):
    out = [f"pm.test('status is {code}', function () {{ pm.response.to.have.status({code}); }});"]
    if error_code:
        out.append(f"pm.test('error code is {error_code}', function () {{ pm.expect(pm.response.json().error.code).to.eql('{error_code}'); }});")
    return out


def req(name, method, path, body=None, auth=None, test_lines=(), pre_lines=(), raw_body=None):
    headers = [{"key": "Content-Type", "value": "application/json"}] if (body is not None or raw_body is not None) else []
    if auth:
        headers.append({"key": "Authorization", "value": f"Bearer {auth}"})
    url_raw = "{{baseUrl}}" + path
    path_part, _, query = path.partition("?")
    url = {"raw": url_raw, "host": ["{{baseUrl}}"], "path": [p for p in path_part.strip("/").split("/") if p]}
    if query:
        url["query"] = [dict(zip(("key", "value"), (q.split("=", 1) + [""])[:2])) for q in query.split("&")]
    item = {"name": name, "request": {"method": method, "header": headers, "url": url}, "event": []}
    if body is not None or raw_body is not None:
        item["request"]["body"] = {"mode": "raw", "raw": raw_body if raw_body is not None else json.dumps(body, indent=2), "options": {"raw": {"language": "json"}}}
    if pre_lines:
        item["event"].append(prereq(*pre_lines))
    item["event"].append(tests(*test_lines))
    return item


def rate_limit_loop(method, path, body_js, max_tries, auth_var=None):
    """A test script that keeps sending the request with pm.sendRequest until it gets a 429."""
    auth = f"header.push({{ key: 'Authorization', value: 'Bearer ' + pm.collectionVariables.get('{auth_var}') }});" if auth_var else ""
    return [
        "const header = [{ key: 'Content-Type', value: 'application/json' }];",
        auth,
        f"const max = {max_tries};",
        "let tries = 0;",
        "function fire() {",
        "  tries += 1;",
        f"  pm.sendRequest({{ url: pm.environment.get('baseUrl') + '{path}', method: '{method}', header, body: {{ mode: 'raw', raw: {body_js} }} }}, function (err, res) {{",
        "    if (!err && res.code === 429) {",
        "      pm.test('rate limit reached: 429 after ' + tries + ' extra requests', function () { pm.expect(res.code).to.eql(429); });",
        "      pm.test('429 uses the JSON error shape', function () { pm.expect(res.json()).to.eql({ error: { code: 'rate_limited', message: 'Too many requests, try again later' } }); });",
        "      return;",
        "    }",
        "    if (tries >= max) { pm.test('rate limit reached within ' + max + ' requests', function () { pm.expect.fail('no 429'); }); return; }",
        "    fire();",
        "  });",
        "}",
        "fire();",
    ]


def collection(name, description, items):
    return {
        "info": {"_postman_id": str(uuid.uuid5(uuid.NAMESPACE_URL, "nutritale/" + name)), "name": name, "description": description, "schema": SCHEMA},
        "event": [tests(COMMON_TESTS)],
        "variable": [],
        "item": items,
    }


REGISTER_PRE = [
    "// A fresh email for every run, so the collection can run again without a database reset.",
    "pm.collectionVariables.set('email', 'postman+' + Date.now() + '-' + Math.floor(Math.random() * 1e6) + '@example.test');",
]


def register_item(name="Register (valid) -> 201", var_prefix=""):
    p = var_prefix
    return req(
        name, "POST", "/auth/register",
        raw_body='{\n  "email": "{{' + p + 'email}}",\n  "password": "{{password}}",\n  "firstName": "Thandi",\n  "market": "ZA",\n  "locale": "en-ZA"\n}',
        pre_lines=[l.replace("'email'", f"'{p}email'") for l in REGISTER_PRE],
        test_lines=status_test(201) + [
            "const b = pm.response.json();",
            "pm.test('returns user and tokens', function () {",
            "  pm.expect(b.user.email).to.eql(pm.collectionVariables.get('" + p + "email'));",
            "  pm.expect(b.tokenType).to.eql('Bearer');",
            "  pm.expect(b.expiresIn).to.eql(900);",
            "  pm.expect(b.refreshToken).to.match(/^[A-Za-z0-9_-]{43}$/);",
            "});",
            "pm.test('password is never returned', function () { pm.expect(pm.response.text()).to.not.include(pm.environment.get('password')); });",
            "pm.collectionVariables.set('" + p + "accessToken', b.accessToken);",
            "pm.collectionVariables.set('" + p + "refreshToken', b.refreshToken);",
            "pm.collectionVariables.set('" + p + "userId', b.user.id);",
        ],
    )


# ---------------------------------------------------------------- 01 Authentication
auth_items = [
    register_item(),
    req("Register duplicate email (other case) -> 409", "POST", "/auth/register",
        raw_body='{\n  "email": "{{email}}",\n  "password": "{{password}}",\n  "firstName": "Thandi",\n  "market": "ZA",\n  "locale": "en-ZA"\n}',
        pre_lines=["pm.variables.set('email', pm.collectionVariables.get('email').toUpperCase());"],
        test_lines=status_test(409, "email_taken")),
    req("Register password under 10 characters -> 400", "POST", "/auth/register",
        body={"email": "short@example.test", "password": "123456789", "firstName": "A", "market": "ZA", "locale": "en-ZA"},
        test_lines=status_test(400, "validation_error")),
    req("Register missing fields -> 400", "POST", "/auth/register", body={"email": "missing@example.test"},
        test_lines=status_test(400, "validation_error")),
    req("Register wrong types -> 400", "POST", "/auth/register",
        body={"email": "types@example.test", "password": 12345678901, "firstName": "A", "market": ["ZA"], "locale": "en-ZA"},
        test_lines=status_test(400, "validation_error")),
    req("Register extra field (role) -> 400", "POST", "/auth/register",
        body={"email": "extra@example.test", "password": "long-enough-pass", "firstName": "A", "market": "ZA", "locale": "en-ZA", "role": "admin"},
        test_lines=status_test(400, "validation_error")),
    req("Register unknown market -> 400", "POST", "/auth/register",
        body={"email": "mkt@example.test", "password": "long-enough-pass", "firstName": "A", "market": "XX", "locale": "en-ZA"},
        test_lines=status_test(400, "validation_error")),
    req("Register malformed JSON -> 400", "POST", "/auth/register", raw_body='{"email": ',
        test_lines=status_test(400)),
    req("Login (valid, upper-case email) -> 200", "POST", "/auth/login",
        raw_body='{\n  "email": "{{emailUpper}}",\n  "password": "{{password}}"\n}',
        pre_lines=["pm.variables.set('emailUpper', pm.collectionVariables.get('email').toUpperCase());"],
        test_lines=status_test(200) + [
            "pm.test('returns tokens', function () { pm.expect(pm.response.json().accessToken).to.be.a('string'); });",
            "pm.collectionVariables.set('login2AccessToken', pm.response.json().accessToken);",
        ]),
    req("Login unknown email -> 401 invalid_credentials", "POST", "/auth/login",
        body={"email": "nobody-here@example.test", "password": "whatever-password"},
        test_lines=status_test(401, "invalid_credentials") + [
            "pm.collectionVariables.set('unknownEmailBody', pm.response.text());",
        ]),
    req("Login wrong password -> same 401 as unknown email (no enumeration)", "POST", "/auth/login",
        raw_body='{\n  "email": "{{email}}",\n  "password": "wrong-password-1"\n}',
        test_lines=status_test(401, "invalid_credentials") + [
            "pm.test('same body as the unknown-email response', function () { pm.expect(pm.response.text()).to.eql(pm.collectionVariables.get('unknownEmailBody')); });",
        ]),
    req("Login operator injection { $ne } -> 400", "POST", "/auth/login",
        raw_body='{\n  "email": "{{email}}",\n  "password": { "$ne": "" }\n}',
        test_lines=status_test(400, "validation_error")),
    req("Refresh (rotate) -> 200 new pair", "POST", "/auth/refresh",
        raw_body='{\n  "refreshToken": "{{refreshToken}}"\n}',
        test_lines=status_test(200) + [
            "const b = pm.response.json();",
            "pm.test('new refresh token differs from the old one', function () { pm.expect(b.refreshToken).to.not.eql(pm.collectionVariables.get('refreshToken')); });",
            "pm.collectionVariables.set('oldRefreshToken', pm.collectionVariables.get('refreshToken'));",
            "pm.collectionVariables.set('refreshToken', b.refreshToken);",
            "pm.collectionVariables.set('accessToken', b.accessToken);",
        ]),
    req("GET /me with the rotated access token -> 200", "GET", "/me", auth="{{accessToken}}", test_lines=status_test(200)),
    req("Refresh reuse of the OLD token -> 401", "POST", "/auth/refresh",
        raw_body='{\n  "refreshToken": "{{oldRefreshToken}}"\n}',
        test_lines=status_test(401, "invalid_refresh_token")),
    req("Refresh with the NEW token after reuse -> 401 (family revoked)", "POST", "/auth/refresh",
        raw_body='{\n  "refreshToken": "{{refreshToken}}"\n}',
        test_lines=status_test(401, "invalid_refresh_token")),
    req("GET /me with the new access token after reuse -> 401", "GET", "/me", auth="{{accessToken}}",
        test_lines=status_test(401, "unauthorized")),
    req("Refresh malformed token -> 400", "POST", "/auth/refresh", body={"refreshToken": "short"},
        test_lines=status_test(400, "validation_error")),
    req("Refresh extra field -> 400", "POST", "/auth/refresh", body={"refreshToken": "A" * 43, "x": 1},
        test_lines=status_test(400, "validation_error")),
    req("Logout missing auth -> 401", "POST", "/auth/logout", test_lines=status_test(401, "unauthorized")),
    req("Logout invalid signature -> 401", "POST", "/auth/logout", auth=BAD_SIG_TOKEN, test_lines=status_test(401, "unauthorized")),
    req("Logout alg none -> 401", "POST", "/auth/logout", auth=ALG_NONE_TOKEN, test_lines=status_test(401, "unauthorized")),
    req("Logout extra body field -> 400", "POST", "/auth/logout", body={"everywhere": True}, auth="{{login2AccessToken}}",
        test_lines=status_test(400, "validation_error")),
    req("Logout (valid) -> 204", "POST", "/auth/logout", auth="{{login2AccessToken}}", test_lines=status_test(204)),
    req("GET /me after logout -> 401", "GET", "/me", auth="{{login2AccessToken}}", test_lines=status_test(401, "unauthorized")),
    req("Auth rate limit -> 429 (repeats login until limited)", "POST", "/auth/login",
        body={"email": "limit@example.test", "password": "wrong-password-1"},
        test_lines=["pm.test('first call answers 401 or 429', function () { pm.expect([401, 429]).to.include(pm.response.code); });"]
        + rate_limit_loop("POST", "/auth/login", "JSON.stringify({ email: 'limit@example.test', password: 'wrong-password-1' })", 100)),
]

# ---------------------------------------------------------------- 02 User management
user_items = [
    register_item("Register user A -> 201"),
    register_item("Register user B -> 201", var_prefix="b_"),
    req("GET /me (valid) -> 200", "GET", "/me", auth="{{accessToken}}",
        test_lines=status_test(200) + ["pm.test('it is user A', function () { pm.expect(pm.response.json().user.id).to.eql(pm.collectionVariables.get('userId')); });"]),
    req("GET /me missing auth -> 401", "GET", "/me", test_lines=status_test(401, "unauthorized")),
    req("GET /me invalid signature -> 401", "GET", "/me", auth=BAD_SIG_TOKEN, test_lines=status_test(401, "unauthorized")),
    req("GET /me alg none -> 401", "GET", "/me", auth=ALG_NONE_TOKEN, test_lines=status_test(401, "unauthorized")),
    req("GET /me garbage token -> 401", "GET", "/me", auth="not-a-token", test_lines=status_test(401, "unauthorized")),
    req("GET /me another user's id in the query -> 400", "GET", "/me?userId={{b_userId}}", auth="{{accessToken}}",
        test_lines=status_test(400, "validation_error")),
    req("GET /me role parameter -> 400 (no roles in V1)", "GET", "/me?role=admin", auth="{{accessToken}}",
        test_lines=status_test(400, "validation_error")),
    req("PATCH preferences (valid) -> 200", "PATCH", "/me/preferences", auth="{{accessToken}}",
        body={"allergens": ["milk", "peanuts"], "diets": ["vegetarian"]},
        test_lines=status_test(200) + ["pm.test('saved', function () { pm.expect(pm.response.json().user.preferences).to.eql({ allergens: ['milk', 'peanuts'], diets: ['vegetarian'] }); });"]),
    req("PATCH preferences missing auth -> 401", "PATCH", "/me/preferences", body={"diets": ["vegan"]}, test_lines=status_test(401, "unauthorized")),
    req("PATCH preferences allergen not in ZA list (sesame) -> 400", "PATCH", "/me/preferences", auth="{{accessToken}}",
        body={"allergens": ["sesame"]}, test_lines=status_test(400, "allergen_not_in_market")),
    req("PATCH preferences unknown allergen -> 400", "PATCH", "/me/preferences", auth="{{accessToken}}",
        body={"allergens": ["not-an-allergen"]}, test_lines=status_test(400, "validation_error")),
    req("PATCH preferences empty body (no fields) -> 400", "PATCH", "/me/preferences", auth="{{accessToken}}",
        body={}, test_lines=status_test(400, "validation_error")),
    req("PATCH preferences wrong types -> 400", "PATCH", "/me/preferences", auth="{{accessToken}}",
        body={"allergens": "milk", "diets": 5}, test_lines=status_test(400, "validation_error")),
    req("PATCH preferences extra field -> 400", "PATCH", "/me/preferences", auth="{{accessToken}}",
        body={"diets": ["vegan"], "isPremium": True}, test_lines=status_test(400, "validation_error")),
    req("PATCH preferences with user B's id in the body -> 400", "PATCH", "/me/preferences", auth="{{accessToken}}",
        raw_body='{\n  "diets": ["vegan"],\n  "userId": "{{b_userId}}"\n}', test_lines=status_test(400, "validation_error")),
    req("PATCH preferences market US with sesame -> 200", "PATCH", "/me/preferences", auth="{{accessToken}}",
        body={"market": "US", "locale": "en-US", "allergens": ["sesame", "wheat"]}, test_lines=status_test(200)),
    req("GET /me as user B: unchanged by A -> 200", "GET", "/me", auth="{{b_accessToken}}",
        test_lines=status_test(200) + ["pm.test('B preferences untouched', function () { pm.expect(pm.response.json().user.preferences).to.eql({ allergens: [], diets: [] }); });"]),
    req("DELETE /me missing auth -> 401", "DELETE", "/me", raw_body='{\n  "password": "{{password}}"\n}', test_lines=status_test(401, "unauthorized")),
    req("DELETE /me wrong password -> 403", "DELETE", "/me", auth="{{accessToken}}", body={"password": "wrong-password-1"},
        test_lines=status_test(403, "password_incorrect")),
    req("DELETE /me missing password -> 400", "DELETE", "/me", auth="{{accessToken}}", body={}, test_lines=status_test(400, "validation_error")),
    req("DELETE /me wrong type -> 400", "DELETE", "/me", auth="{{accessToken}}", body={"password": 1234567890}, test_lines=status_test(400, "validation_error")),
    req("DELETE /me extra field -> 400", "DELETE", "/me", auth="{{accessToken}}",
        raw_body='{\n  "password": "{{password}}",\n  "userId": "{{b_userId}}"\n}', test_lines=status_test(400, "validation_error")),
    req("DELETE /me (valid, user A) -> 204", "DELETE", "/me", auth="{{accessToken}}", raw_body='{\n  "password": "{{password}}"\n}',
        test_lines=status_test(204)),
    req("GET /me with A's token after deletion -> 401", "GET", "/me", auth="{{accessToken}}", test_lines=status_test(401, "unauthorized")),
    req("Login as deleted A -> 401", "POST", "/auth/login", raw_body='{\n  "email": "{{email}}",\n  "password": "{{password}}"\n}',
        test_lines=status_test(401, "invalid_credentials")),
    req("GET /me as user B still works -> 200", "GET", "/me", auth="{{b_accessToken}}", test_lines=status_test(200)),
    req("Global rate limit on /me -> 429 (repeats until limited)", "GET", "/me", auth="{{b_accessToken}}",
        test_lines=["pm.test('first call answers 200 or 429', function () { pm.expect([200, 429]).to.include(pm.response.code); });"]
        + rate_limit_loop("GET", "/me", "''", 1000, auth_var="b_accessToken")),
]

# ---------------------------------------------------------------- 04 Ingredient matching
cat_items = [
    req("Search dhania (en-ZA) -> Coriander via alias", "GET", "/catalogue/search?q=dhania&locale=en-ZA",
        test_lines=status_test(200) + [
            "const b = pm.response.json();",
            "pm.test('alias match to Coriander', function () { pm.expect(b.status).to.eql('alias'); pm.expect(b.results[0].name).to.eql('Coriander'); });",
        ]),
    req("Search coriander (en-US) -> Cilantro", "GET", "/catalogue/search?q=coriander&locale=en-US",
        test_lines=status_test(200) + ["pm.test('US name', function () { pm.expect(pm.response.json().results[0].name).to.eql('Cilantro'); });"]),
    req("Search brinjol (typo) -> did you mean Brinjal", "GET", "/catalogue/search?q=brinjol&locale=en-ZA",
        test_lines=status_test(200) + [
            "const b = pm.response.json();",
            "pm.test('fuzzy with didYouMean', function () { pm.expect(b.status).to.eql('fuzzy'); pm.expect(b.didYouMean.name).to.eql('Brinjal'); pm.expect(b.canAddCustom).to.eql(true); });",
        ]),
    req("Search xyzberry -> unknown, never a dead end", "GET", "/catalogue/search?q=xyzberry&locale=en-ZA",
        test_lines=status_test(200) + [
            "const b = pm.response.json();",
            "pm.test('suggestions and add-custom', function () { pm.expect(b.status).to.eql('unknown'); pm.expect(b.suggestions.length).to.be.above(0); pm.expect(b.canAddCustom).to.eql(true); });",
        ]),
    req("Search tomatos -> Tomatoes (plural folding)", "GET", "/catalogue/search?q=tomatos&locale=en-ZA",
        test_lines=status_test(200) + [
            "pm.test('max 8 results', function () { pm.expect(pm.response.json().results.length).to.be.at.most(8); });",
            "pm.test('no internal fields', function () { pm.expect(pm.response.text()).to.not.match(/\"aliases\"|\"substitutes\"|\"names\"/); });",
        ]),
    req("Search empty q -> status empty", "GET", "/catalogue/search?q=",
        test_lines=status_test(200) + ["pm.test('empty', function () { pm.expect(pm.response.json().status).to.eql('empty'); });"]),
    req("Search q of 65 characters -> 400", "GET", "/catalogue/search?q=" + "a" * 65, test_lines=status_test(400, "validation_error")),
    req("Search missing q -> 400", "GET", "/catalogue/search", test_lines=status_test(400, "validation_error")),
    req("Search repeated q -> 400", "GET", "/catalogue/search?q=a&q=b", test_lines=status_test(400, "validation_error")),
    req("Search unknown locale -> 400", "GET", "/catalogue/search?q=salt&locale=zz-ZZ", test_lines=status_test(400, "validation_error")),
    req("Search extra parameter -> 400", "GET", "/catalogue/search?q=salt&debug=1", test_lines=status_test(400, "validation_error")),
    req("Substitutes amasi (en-US) -> Buttermilk", "GET", "/catalogue/amasi/substitutes?locale=en-US",
        test_lines=status_test(200) + ["pm.test('Buttermilk with a note', function () { const s = pm.response.json().substitutes[0]; pm.expect(s.name).to.eql('Buttermilk'); pm.expect(s.note).to.be.a('string'); });"]),
    req("Substitutes unknown id -> 404", "GET", "/catalogue/no-such-thing/substitutes", test_lines=status_test(404, "not_found")),
    req("Substitutes malformed id -> 400", "GET", "/catalogue/BAD%24ID/substitutes", test_lines=status_test(400, "validation_error")),
    req("Substitutes extra parameter -> 400", "GET", "/catalogue/amasi/substitutes?x=1", test_lines=status_test(400, "validation_error")),
    req("Catalogue rate limit -> 429 (repeats until limited)", "GET", "/catalogue/search?q=salt",
        test_lines=["pm.test('first call answers 200 or 429', function () { pm.expect([200, 429]).to.include(pm.response.code); });"]
        + rate_limit_loop("GET", "/catalogue/search?q=salt", "''", 200)),
]

DESC_COMMON = (
    " Run against a local API started with STORAGE=memory (see apps/api/README.md). "
    "Each collection ends with a rate-limit request that keeps calling until it gets 429, so restart the API between collections. "
    "The expired-token case needs clock control and is covered by the vitest suite (apps/api/src/__tests__/security-matrix.test.ts), not here."
)

collections = {
    "01-authentication.postman_collection.json": collection(
        "NutriTale 01 Authentication",
        "Register, login, refresh rotation and reuse detection, logout, no user enumeration, auth rate limit." + DESC_COMMON,
        auth_items,
    ),
    "02-user-management.postman_collection.json": collection(
        "NutriTale 02 User management",
        "GET /me, PATCH /me/preferences, DELETE /me against the SECURITY_AUDIT.md 12 cases (case 3 in vitest; case 5 not applicable)." + DESC_COMMON,
        user_items,
    ),
    "04-ingredient-matching.postman_collection.json": collection(
        "NutriTale 04 Ingredient matching",
        "Public catalogue search (no-dead-end ladder) and substitutes, input limits, catalogue rate limit." + DESC_COMMON,
        cat_items,
    ),
}
for fname, data in collections.items():
    (OUT / fname).write_text(json.dumps(data, indent=2) + "\n")

env = {
    "id": str(uuid.uuid5(uuid.NAMESPACE_URL, "nutritale/local-env")),
    "name": "NutriTale local",
    "values": [
        {"key": "baseUrl", "value": "http://localhost:4000", "type": "default", "enabled": True},
        {"key": "password", "value": "local-test-password-only", "type": "default", "enabled": True},
    ],
    "_postman_variable_scope": "environment",
}
(OUT / "local.postman_environment.json").write_text(json.dumps(env, indent=2) + "\n")
print("wrote", ", ".join(collections), "and local.postman_environment.json")
