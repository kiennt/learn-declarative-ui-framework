%start JSONText

%%

JSONText 
  : JSONValue EOF
    { return $1; }
  ;

JSONValue
  : JSONNumber
  | JSONString
  | JSONBooleanLiteral
  | JSONNullLiteral
  | JSONObject
  | JSONArray
  ;

JSONNumber
  : NUMBER
    { $$ = Number($1); }
  ;

JSONString 
  : STRING
    { $$ = $1.slice(1, -1); }
  ;

JSONBooleanLiteral
  : TRUE
    { $$ = true; }
  | FALSE
    { $$ = false; }
  ;

JSONNullLiteral 
  : NULL
    { $$ = null; }
  ;

JSONObject
  : '{' '}'
    { $$ = {}; }
  | '{' JSONObjectMember '}'
    { $$ = $2; }
  ;

JSONObjectMember
  : JSONString ':' JSONValue
    { $$ = {}; $$[$1] = $3; }
  | JSONObjectMember ',' JSONString ':' JSONValue
    { $$ = $1; $$[$3] = $5; }
  ;

JSONArray
  : '[' ']'
    { $$ = []; }
  | '[' JSONArrayMember ']'
    { $$ = $2; }
  ;

JSONArrayMember
  : JSONValue
    { $$ = [$1]; }
  | JSONArrayMember ',' JSONValue
    { $$ = $1; $$.push($3); }
  ;