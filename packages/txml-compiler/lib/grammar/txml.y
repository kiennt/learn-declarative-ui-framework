%start root

%ebnf

%%

root
  : node+ EOF 
    { return $1; }
  ;

node
  : node_start '/>'
    {
      $$ = {
        type: 'NODE',
        tag: $1.tag,
        props: $1.props,
        children: [],
      }
    }
  | node_start '>' node_child* '</' IDENT '>'
    {
      if ($1.tag !== $5) {
        throw new Error("invalid close tag")
      }
      $$ = {
        type: 'NODE',
        tag: $1.tag,
        props: $1.props,
        children: $3,
      }
    }
  ;

node_start
  : '<' IDENT node_attribute* 
    {
      $$ = {
        tag: $2,
        props: $3.reduce((acc, item) => { 
          acc[item[0]] = item[1].length === 1 ? item[1][0] : item[1]; 
          return acc; 
        }, {}),
        children: [],
      }
    }
  ;


node_attribute
  : attribute_name '=' DQUOTE value* DQUOTE -> [$1, $4]
  ;

attribute_name
  : IDENT
  | DIRECTIVE
  ;

node_child
  : value
  | node
  ;

value 
  : variable -> $1
  | STRING -> $1
  | '{{' expr '}}' -> { type: 'EXPR', expr: $2 }
  ;

expr
  : variable -> $1
  | DQUOTE STRING DQUOTE -> $2
  | DQUOTE IDENT DQUOTE -> $2
  ;

variable
  : IDENT -> $1
  | NUMBER -> Number($1)
  | TRUE -> true
  | FALSE -> false
  | UNDEFINED -> undefined
  | NULL -> null
  ;
