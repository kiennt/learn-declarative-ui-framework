%start document

%%

document
  : value EOF
    { return $1; }
  ;

value
  : number
  | string
  | boolean_literal
  | null_liternal
  | object
  | array
  ;

number
  : NUMBER
    { $$ = Number($1); }
  ;

string
  : STRING
    { $$ = $1.slice(1, -1); }
  ;

boolean_literal
  : TRUE
    { $$ = true; }
  | FALSE
    { $$ = false; }
  ;

null_liternal
  : NULL
    { $$ = null; }
  ;

object
  : '{' '}'
    { $$ = {}; }
  | '{' object_member '}'
    { $$ = $2; }
  ;

object_member
  : string ':' value
    { $$ = {}; $$[$1] = $3; }
  | object_member ',' string ':' value
    { $$ = $1; $$[$3] = $5; }
  ;

array
  : '[' ']'
    { $$ = []; }
  | '[' array_member ']'
    { $$ = $2; }
  ;

array_member
  : value
    { $$ = [$1]; }
  | array_member ',' value
    { $$ = $1; $$.push($3); }
  ;