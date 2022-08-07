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
  : attribute_name '=' attribute_value -> [$1, $3]
  ;

attribute_name
  : IDENT
  | DIRECTIVE
  ;

attribute_value
  : SQUOTE value+ SQUOTE -> $2
  | DQUOTE value+ DQUOTE -> $2
  ;

node_child
  : value
  | node
  ;

value 
  : variable -> $1
  | '{{' expr '}}' -> { type: 'EXPR', expr: $2 }
  ;

expr
  : variable -> $1
  | SQUOTE IDENT SQUOTE -> $2
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
