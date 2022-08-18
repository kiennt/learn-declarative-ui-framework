%start root

%left '.'
%left '?' ':'
%left '+' '-'
%left '*' '/' '%' '**'
%left '===' '==' '!==' '!=' '>=' '<=' '>' '<' '&&' '||'
%nonassoc '!' UMINUS

%type <a> expr

%ebnf

%%

root
  : node+ EOF 
    { return yy.ast.createRootNode($1); }
  ;

node
  : node_start '/>' -> $1
  | node_start '>' node_child* '</' IDENT '>'
    {
      if ($1.tag !== $5) {
        throw new Error("invalid close tag")
      }
      $$ = $1;
      $$.children = yy.ast.trimSpaceInChildren($3);
    }
  ;

node_start
  : '<' IDENT node_attribute* -> yy.ast.createElementNode($2, $3, [])
  ;


node_attribute
  : attribute_name '=' DQUOTE value* DQUOTE 
    {
      const node = $1;
      if (node.type === 'ident') {
        $$ = yy.ast.createAttributeNode(node.name, $4);
      } else {
        $$ = yy.ast.createDirectiveNode(node.name, node.prefix, $4);
      }
    }
  ;

attribute_name
  : IDENT -> { type: "ident", name: $1 }
  | DIRECTIVE 
    { 
      const value = $1;
      const pos = value.indexOf(':');
      const prefix = value.slice(0, pos);
      const name = value.slice(pos + 1);
      $$ = { type: "directive", name, prefix };
    }
  ;

node_child
  : value
  | node
  ;

value 
  : STRING 
    {
      const expr = yy.ast.createConstantExpr($1);
      $$ = yy.ast.createExprNode(expr)
    }
  | '{{' common_expr '}}' -> yy.ast.createExprNode($2)
  | '{{' object_expr_members '}}' -> yy.ast.createExprNode($2)
  ;

common_expr
  : simple_expr
  | object_access_expr
  | arithmetic_expr
  | one_arg_expr
  | condition_expr
  | tenary_expr
  | array_expr
  | function_call_expr
  ;

expr
  : common_expr
  | object_expr
  ;

simple_expr
  : variable 
  | constant 
  | '(' expr ')' -> $2
  ;

variable
  : IDENT -> yy.ast.createVariableExpr($1)
  ;

constant
  : DQUOTE STRING DQUOTE -> yy.ast.createConstantExpr($2);
  | NUMBER -> yy.ast.createConstantExpr(Number($1))
  | TRUE -> yy.ast.createConstantExpr(true)
  | FALSE -> yy.ast.createConstantExpr(false)
  | UNDEFINED -> yy.ast.createConstantExpr(undefined)
  | NULL -> yy.ast.createConstantExpr(null)
  ;

object_access_expr
  : expr '.' IDENT 
    {
      if ($1.type === yy.ast.ExprTypes.OBJECT_ACCESS) {
        $$ = $1;
        $$.paths.push($3);
      } else {
        $$ = yy.ast.createObjectAccessExpr($1, [$3]);
      }
    }
  ;

arithmetic_expr
  : expr '+' expr -> yy.ast.createArithmeticExpr(yy.ast.ArithmeticOpTypes.ADD, $1, $3)
  | expr '-' expr -> yy.ast.createArithmeticExpr(yy.ast.ArithmeticOpTypes.SUBTRACT, $1, $3)
  | expr '*' expr -> yy.ast.createArithmeticExpr(yy.ast.ArithmeticOpTypes.MULTIPLE, $1, $3)
  | expr '/' expr -> yy.ast.createArithmeticExpr(yy.ast.ArithmeticOpTypes.DIVIDE , $1, $3)
  | expr '%' expr -> yy.ast.createArithmeticExpr(yy.ast.ArithmeticOpTypes.MODULE , $1, $3)
  | expr '**' expr -> yy.ast.createArithmeticExpr(yy.ast.ArithmeticOpTypes.POWER, $1, $3)
  ;

one_arg_expr
  : '-' expr %prec UMINUS -> yy.ast.createOneArgExpr(yy.ast.OneArgOpTypes.MINUS, $2)
  | '!' expr -> yy.ast.createOneArgExpr(yy.ast.OneArgOpTypes.NOT, $2)
  ;

condition_expr 
  : expr '===' expr -> yy.ast.createConditionExpr(yy.ast.ConditionOpTypes.DEEP_EQUAL, $1, $3)
  | expr '==' expr -> yy.ast.createConditionExpr(yy.ast.ConditionOpTypes.EQUAL, $1, $3)
  | expr '!==' expr -> yy.ast.createConditionExpr(yy.ast.ConditionOpTypes.DEEP_NOT_EQUAL, $1, $3)
  | expr '!=' expr -> yy.ast.createConditionExpr(yy.ast.ConditionOpTypes.NOT_EQUAL, $1, $3)
  | expr '>=' expr -> yy.ast.createConditionExpr(yy.ast.ConditionOpTypes.GREATER_THAN_EQUAL, $1, $3)
  | expr '>' expr -> yy.ast.createConditionExpr(yy.ast.ConditionOpTypes.GREATER_THAN, $1, $3)
  | expr '<=' expr -> yy.ast.createConditionExpr(yy.ast.ConditionOpTypes.LESS_THAN_EQUAL, $1, $3)
  | expr '<' expr -> yy.ast.createConditionExpr(yy.ast.ConditionOpTypes.LESS_THAN, $1, $3)
  | expr '&&' expr -> yy.ast.createConditionExpr(yy.ast.ConditionOpTypes.AND, $1, $3)
  | expr '||' expr -> yy.ast.createConditionExpr(yy.ast.ConditionOpTypes.OR, $1, $3)
  ;

tenary_expr
  : expr '?' expr ':' expr -> yy.ast.createTenaryExpr($1, $3, $5);
  ;

array_expr
  : '[' array_expr_members ']' -> yy.ast.createArrayExpr($2);
  ;

array_expr_members
  : /* empty */ -> []
  | expr -> [$1]
  | array_expr_members ',' expr 
    {
      $$ = $1;
      $1.push($3);
    }
  ;

object_expr
  : '{' object_expr_members '}' -> $2
  ;

object_expr_members
  : /* empty */ -> yy.ast.createObjectExpr([], [])
  | object_expr_member 
    {
      $$ = yy.ast.createObjectExpr([], []);
      if ($1.type === 'destructuring') {
        $$.destructuringList.push($1.expr);
      } else {
        $$.props.push({
          key: $1.key,
          value: $1.value,
        })
      }
    }
  | object_expr_members ',' object_expr_member
    {
      $$ = $1;
      if ($3.type === 'destructuring') {
        $$.destructuringList.push($3.expr);
      } else {
        $$.props.push({
          key: $3.key,
          value: $3.value,
        })
      }
    }
  ;

object_expr_member
  : '...' expr -> { type: 'destructuring', expr: $2 }
  | IDENT ':' expr -> { type: 'key', key: $1, value: $3 }
  ;

function_call_expr
  : variable '(' array_expr_members ')' -> yy.ast.createFunctionCallExpr($1, $3)
  | object_access_expr '(' array_expr_members ')' -> yy.ast.createFunctionCallExpr($1, $3)
  ;