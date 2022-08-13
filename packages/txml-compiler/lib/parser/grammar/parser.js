/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,5],$V1=[5,13],$V2=[5,11,13,23,24],$V3=[11,13,23,24],$V4=[8,9,12,20],$V5=[1,17],$V6=[1,18],$V7=[11,13,18,23,24],$V8=[2,58],$V9=[1,44],$Va=[1,37],$Vb=[1,45],$Vc=[1,46],$Vd=[1,47],$Ve=[1,48],$Vf=[1,49],$Vg=[1,39],$Vh=[1,40],$Vi=[1,41],$Vj=[1,51],$Vk=[1,42],$Vl=[2,21],$Vm=[1,56],$Vn=[9,13,26,41,47,48,49,50,51,52,53,55,56,57,58,59,60,61,62,63,64,67,68,70],$Vo=[26,68,70],$Vp=[1,61],$Vq=[1,74],$Vr=[1,76],$Vs=[1,62],$Vt=[1,63],$Vu=[1,64],$Vv=[1,65],$Vw=[1,66],$Vx=[1,67],$Vy=[1,68],$Vz=[1,69],$VA=[1,70],$VB=[1,71],$VC=[1,72],$VD=[1,73],$VE=[1,75],$VF=[1,77],$VG=[1,78],$VH=[1,79],$VI=[2,54],$VJ=[2,26],$VK=[1,85],$VL=[1,88],$VM=[41,68],$VN=[9,13,26,40,41,47,48,49,50,51,52,53,55,56,57,58,59,60,61,62,63,64,67,68,70],$VO=[1,113],$VP=[41,67,68],$VQ=[18,23,24],$VR=[26,41,47,48,49,63,64,67,68,70],$VS=[26,41,47,48,49,50,51,52,53,63,64,67,68,70];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"root":3,"root_repetition_plus0":4,"EOF":5,"node":6,"node_start":7,"/>":8,">":9,"node_repetition0":10,"</":11,"IDENT":12,"<":13,"node_start_repetition0":14,"node_attribute":15,"attribute_name":16,"=":17,"DQUOTE":18,"node_attribute_repetition0":19,"DIRECTIVE":20,"node_child":21,"value":22,"STRING":23,"{{":24,"common_expr":25,"}}":26,"object_expr_members":27,"simple_expr":28,"object_access_expr":29,"arithmetic_expr":30,"one_arg_expr":31,"condition_expr":32,"tenary_expr":33,"array_expr":34,"function_call_expr":35,"expr":36,"object_expr":37,"variable":38,"constant":39,"(":40,")":41,"NUMBER":42,"TRUE":43,"FALSE":44,"UNDEFINED":45,"NULL":46,".":47,"+":48,"-":49,"*":50,"/":51,"%":52,"**":53,"!":54,"===":55,"==":56,"!==":57,"!=":58,">=":59,"<=":60,"&&":61,"||":62,"?":63,":":64,"[":65,"array_expr_members":66,"]":67,",":68,"{":69,"}":70,"object_expr_member":71,"...":72,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"/>",9:">",11:"</",12:"IDENT",13:"<",17:"=",18:"DQUOTE",20:"DIRECTIVE",23:"STRING",24:"{{",26:"}}",40:"(",41:")",42:"NUMBER",43:"TRUE",44:"FALSE",45:"UNDEFINED",46:"NULL",47:".",48:"+",49:"-",50:"*",51:"/",52:"%",53:"**",54:"!",55:"===",56:"==",57:"!==",58:"!=",59:">=",60:"<=",61:"&&",62:"||",63:"?",64:":",65:"[",67:"]",68:",",69:"{",70:"}",72:"..."},
productions_: [0,[3,2],[6,2],[6,6],[7,3],[15,5],[16,1],[16,1],[21,1],[21,1],[22,1],[22,3],[22,3],[25,1],[25,1],[25,1],[25,1],[25,1],[25,1],[25,1],[25,1],[36,1],[36,1],[28,1],[28,1],[28,3],[38,1],[39,3],[39,1],[39,1],[39,1],[39,1],[39,1],[29,3],[30,3],[30,3],[30,3],[30,3],[30,3],[30,3],[31,2],[31,2],[32,3],[32,3],[32,3],[32,3],[32,3],[32,3],[32,3],[32,3],[32,3],[32,3],[33,5],[34,3],[66,0],[66,1],[66,3],[37,3],[27,0],[27,1],[27,3],[71,2],[71,3],[35,4],[35,4],[4,1],[4,2],[10,0],[10,2],[14,0],[14,2],[19,0],[19,2]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 return $$[$0-1]; 
break;
case 2: case 25: case 57:
this.$ = $$[$0-1];
break;
case 3:

      if ($$[$0-5].tag !== $$[$0-1]) {
        throw new Error("invalid close tag")
      }
      this.$ = $$[$0-5];
      this.$.children = $$[$0-3];
    
break;
case 4:
this.$ = yy.ast.createElementNode($$[$0-1], $$[$0], []);
break;
case 5:

      const node = $$[$0-4];
      if (node.type === 'ident') {
        this.$ = yy.ast.createAttributeNode(node.name, $$[$0-1]);
      } else {
        this.$ = yy.ast.createDirectiveNode(node.name, node.prefix, $$[$0-1]);
      }
    
break;
case 6:
this.$ = { type: "ident", name: $$[$0] };
break;
case 7:
 
      const value = $$[$0];
      const pos = value.indexOf(':');
      const prefix = value.slice(0, pos);
      const name = value.slice(pos + 1);
      this.$ = { type: "directive", name, prefix };
    
break;
case 10:

      const expr = yy.ast.createConstantExpr($$[$0]);
      this.$ = yy.ast.createExprNode(expr)
    
break;
case 11: case 12:
this.$ = yy.ast.createExprNode($$[$0-1]);
break;
case 26:
this.$ = yy.ast.createVariableExpr($$[$0]);
break;
case 27:
this.$ = yy.ast.createConstantExpr($$[$0-1]);;
break;
case 28:
this.$ = yy.ast.createConstantExpr(Number($$[$0]));
break;
case 29:
this.$ = yy.ast.createConstantExpr(true);
break;
case 30:
this.$ = yy.ast.createConstantExpr(false);
break;
case 31:
this.$ = yy.ast.createConstantExpr(undefined);
break;
case 32:
this.$ = yy.ast.createConstantExpr(null);
break;
case 33:

      if ($$[$0-2].type === yy.ast.ExprTypes.OBJECT_ACCESS) {
        this.$ = $$[$0-2];
        this.$.paths.push($$[$0]);
      } else {
        this.$ = yy.ast.createObjectAccessExpr($$[$0-2], [$$[$0]]);
      }
    
break;
case 34:
this.$ = yy.ast.createArithmeticExpr(yy.ast.ArithmeticOpTypes.ADD, $$[$0-2], $$[$0]);
break;
case 35:
this.$ = yy.ast.createArithmeticExpr(yy.ast.ArithmeticOpTypes.SUBTRACT, $$[$0-2], $$[$0]);
break;
case 36:
this.$ = yy.ast.createArithmeticExpr(yy.ast.ArithmeticOpTypes.MULTIPLE, $$[$0-2], $$[$0]);
break;
case 37:
this.$ = yy.ast.createArithmeticExpr(yy.ast.ArithmeticOpTypes.DIVIDE , $$[$0-2], $$[$0]);
break;
case 38:
this.$ = yy.ast.createArithmeticExpr(yy.ast.ArithmeticOpTypes.MODULE , $$[$0-2], $$[$0]);
break;
case 39:
this.$ = yy.ast.createArithmeticExpr(yy.ast.ArithmeticOpTypes.POWER, $$[$0-2], $$[$0]);
break;
case 40:
this.$ = yy.ast.createOneArgExpr(yy.ast.OneArgOpTypes.MINUS, $$[$0]);
break;
case 41:
this.$ = yy.ast.createOneArgExpr(yy.ast.OneArgOpTypes.NOT, $$[$0]);
break;
case 42:
this.$ = yy.ast.createConditionExpr(yy.ast.ConditionOpTypes.DEEP_EQUAL, $$[$0-2], $$[$0]);
break;
case 43:
this.$ = yy.ast.createConditionExpr(yy.ast.ConditionOpTypes.EQUAL, $$[$0-2], $$[$0]);
break;
case 44:
this.$ = yy.ast.createConditionExpr(yy.ast.ConditionOpTypes.DEEP_NOT_EQUAL, $$[$0-2], $$[$0]);
break;
case 45:
this.$ = yy.ast.createConditionExpr(yy.ast.ConditionOpTypes.NOT_EQUAL, $$[$0-2], $$[$0]);
break;
case 46:
this.$ = yy.ast.createConditionExpr(yy.ast.ConditionOpTypes.GREATER_THAN_EQUAL, $$[$0-2], $$[$0]);
break;
case 47:
this.$ = yy.ast.createConditionExpr(yy.ast.ConditionOpTypes.GREATER_THAN, $$[$0-2], $$[$0]);
break;
case 48:
this.$ = yy.ast.createConditionExpr(yy.ast.ConditionOpTypes.LESS_THAN_EQUAL, $$[$0-2], $$[$0]);
break;
case 49:
this.$ = yy.ast.createConditionExpr(yy.ast.ConditionOpTypes.LESS_THAN, $$[$0-2], $$[$0]);
break;
case 50:
this.$ = yy.ast.createConditionExpr(yy.ast.ConditionOpTypes.AND, $$[$0-2], $$[$0]);
break;
case 51:
this.$ = yy.ast.createConditionExpr(yy.ast.ConditionOpTypes.OR, $$[$0-2], $$[$0]);
break;
case 52:
this.$ = yy.ast.createTenaryExpr($$[$0-4], $$[$0-2], $$[$0]);;
break;
case 53:
this.$ = yy.ast.createArrayExpr($$[$0-1]);;
break;
case 54: case 67: case 69: case 71:
this.$ = [];
break;
case 55: case 65:
this.$ = [$$[$0]];
break;
case 56:

      this.$ = $$[$0-2];
      $$[$0-2].push($$[$0]);
    
break;
case 58:
this.$ = yy.ast.createObjectExpr([], []);
break;
case 59:

      this.$ = yy.ast.createObjectExpr([], []);
      if ($$[$0].type === 'destructuring') {
        this.$.destructuringList.push($$[$0].expr);
      } else {
        this.$.props.push({
          key: $$[$0].key,
          value: $$[$0].value,
        })
      }
    
break;
case 60:

      this.$ = $$[$0-2];
      if ($$[$0].type === 'destructuring') {
        this.$.destructuringList.push($$[$0].expr);
      } else {
        this.$.props.push({
          key: $$[$0].key,
          value: $$[$0].value,
        })
      }
    
break;
case 61:
this.$ = { type: 'destructuring', expr: $$[$0] };
break;
case 62:
this.$ = { type: 'key', key: $$[$0-2], value: $$[$0] };
break;
case 63: case 64:
this.$ = yy.ast.createFunctionCallExpr($$[$0-3], $$[$0-1]);
break;
case 66: case 68: case 70: case 72:
$$[$0-1].push($$[$0]);
break;
}
},
table: [{3:1,4:2,6:3,7:4,13:$V0},{1:[3]},{5:[1,6],6:7,7:4,13:$V0},o($V1,[2,65]),{8:[1,8],9:[1,9]},{12:[1,10]},{1:[2,1]},o($V1,[2,66]),o($V2,[2,2]),o($V3,[2,67],{10:11}),o($V4,[2,69],{14:12}),{6:16,7:4,11:[1,13],13:$V0,21:14,22:15,23:$V5,24:$V6},o([8,9],[2,4],{15:19,16:20,12:[1,21],20:[1,22]}),{12:[1,23]},o($V3,[2,68]),o($V3,[2,8]),o($V3,[2,9]),o($V7,[2,10]),o([26,68],$V8,{25:24,27:25,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,71:34,38:35,39:36,36:38,37:50,12:[1,43],18:$V9,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj,72:$Vk}),o($V4,[2,70]),{17:[1,52]},{17:[2,6]},{17:[2,7]},{9:[1,53]},o([9,13,47,48,49,50,51,52,53,55,56,57,58,59,60,61,62,63],$Vl,{26:[1,54]}),{26:[1,55],68:$Vm},o($Vn,[2,13]),o($Vn,[2,14],{40:[1,57]}),o($Vn,[2,15]),o($Vn,[2,16]),o($Vn,[2,17]),o($Vn,[2,18]),o($Vn,[2,19]),o($Vn,[2,20]),o($Vo,[2,59]),o($Vn,[2,23],{40:[1,58]}),o($Vn,[2,24]),{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:59,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},{9:$Vq,13:$Vr,47:$Vs,48:$Vt,49:$Vu,50:$Vv,51:$Vw,52:$Vx,53:$Vy,55:$Vz,56:$VA,57:$VB,58:$VC,59:$VD,60:$VE,61:$VF,62:$VG,63:$VH},{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:80,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:81,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},o([67,68],$VI,{28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,38:35,39:36,37:50,25:60,66:82,36:83,12:$Vp,18:$V9,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj}),{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:84,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},o([9,13,26,40,47,48,49,50,51,52,53,55,56,57,58,59,60,61,62,63],$VJ,{64:$VK}),{23:[1,86]},o($Vn,[2,28]),o($Vn,[2,29]),o($Vn,[2,30]),o($Vn,[2,31]),o($Vn,[2,32]),o($Vn,[2,22]),o([68,70],$V8,{71:34,27:87,12:$VL,72:$Vk}),{18:[1,89]},o($V2,[2,3]),o($V7,[2,11]),o($V7,[2,12]),{12:$VL,71:90,72:$Vk},o($VM,$VI,{28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,38:35,39:36,37:50,25:60,36:83,66:91,12:$Vp,18:$V9,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj}),o($VM,$VI,{28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,38:35,39:36,37:50,25:60,36:83,66:92,12:$Vp,18:$V9,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj}),{9:$Vq,13:$Vr,41:[1,93],47:$Vs,48:$Vt,49:$Vu,50:$Vv,51:$Vw,52:$Vx,53:$Vy,55:$Vz,56:$VA,57:$VB,58:$VC,59:$VD,60:$VE,61:$VF,62:$VG,63:$VH},o($Vn,$Vl),o($VN,$VJ),{12:[1,94]},{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:95,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:96,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:97,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:98,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:99,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:100,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:101,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:102,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:103,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:104,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:105,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:106,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:107,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:108,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:109,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:110,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:111,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},o($Vn,[2,40]),o($Vn,[2,41]),{67:[1,112],68:$VO},o($VP,[2,55],{9:$Vq,13:$Vr,47:$Vs,48:$Vt,49:$Vu,50:$Vv,51:$Vw,52:$Vx,53:$Vy,55:$Vz,56:$VA,57:$VB,58:$VC,59:$VD,60:$VE,61:$VF,62:$VG,63:$VH}),o($Vo,[2,61],{9:$Vq,13:$Vr,47:$Vs,48:$Vt,49:$Vu,50:$Vv,51:$Vw,52:$Vx,53:$Vy,55:$Vz,56:$VA,57:$VB,58:$VC,59:$VD,60:$VE,61:$VF,62:$VG,63:$VH}),{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:114,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},{18:[1,115]},{68:$Vm,70:[1,116]},{64:$VK},o($VQ,[2,71],{19:117}),o($Vo,[2,60]),{41:[1,118],68:$VO},{41:[1,119],68:$VO},o($Vn,[2,25]),o($VN,[2,33]),o($VR,[2,34],{9:$Vq,13:$Vr,50:$Vv,51:$Vw,52:$Vx,53:$Vy,55:$Vz,56:$VA,57:$VB,58:$VC,59:$VD,60:$VE,61:$VF,62:$VG}),o($VR,[2,35],{9:$Vq,13:$Vr,50:$Vv,51:$Vw,52:$Vx,53:$Vy,55:$Vz,56:$VA,57:$VB,58:$VC,59:$VD,60:$VE,61:$VF,62:$VG}),o($VS,[2,36],{9:$Vq,13:$Vr,55:$Vz,56:$VA,57:$VB,58:$VC,59:$VD,60:$VE,61:$VF,62:$VG}),o($VS,[2,37],{9:$Vq,13:$Vr,55:$Vz,56:$VA,57:$VB,58:$VC,59:$VD,60:$VE,61:$VF,62:$VG}),o($VS,[2,38],{9:$Vq,13:$Vr,55:$Vz,56:$VA,57:$VB,58:$VC,59:$VD,60:$VE,61:$VF,62:$VG}),o($VS,[2,39],{9:$Vq,13:$Vr,55:$Vz,56:$VA,57:$VB,58:$VC,59:$VD,60:$VE,61:$VF,62:$VG}),o($Vn,[2,42]),o($Vn,[2,43]),o($Vn,[2,44]),o($Vn,[2,45]),o($Vn,[2,46]),o($Vn,[2,47]),o($Vn,[2,48]),o($Vn,[2,49]),o($Vn,[2,50]),o($Vn,[2,51]),{9:$Vq,13:$Vr,47:$Vs,48:$Vt,49:$Vu,50:$Vv,51:$Vw,52:$Vx,53:$Vy,55:$Vz,56:$VA,57:$VB,58:$VC,59:$VD,60:$VE,61:$VF,62:$VG,63:$VH,64:[1,120]},o($Vn,[2,53]),{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:121,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},o($Vo,[2,62],{9:$Vq,13:$Vr,47:$Vs,48:$Vt,49:$Vu,50:$Vv,51:$Vw,52:$Vx,53:$Vy,55:$Vz,56:$VA,57:$VB,58:$VC,59:$VD,60:$VE,61:$VF,62:$VG,63:$VH}),o($Vn,[2,27]),o($Vn,[2,57]),{18:[1,122],22:123,23:$V5,24:$V6},o($Vn,[2,64]),o($Vn,[2,63]),{12:$Vp,18:$V9,25:60,28:26,29:27,30:28,31:29,32:30,33:31,34:32,35:33,36:124,37:50,38:35,39:36,40:$Va,42:$Vb,43:$Vc,44:$Vd,45:$Ve,46:$Vf,49:$Vg,54:$Vh,65:$Vi,69:$Vj},o($VP,[2,56],{9:$Vq,13:$Vr,47:$Vs,48:$Vt,49:$Vu,50:$Vv,51:$Vw,52:$Vx,53:$Vy,55:$Vz,56:$VA,57:$VB,58:$VC,59:$VD,60:$VE,61:$VF,62:$VG,63:$VH}),o($V4,[2,5]),o($VQ,[2,72]),o([26,41,47,63,64,67,68,70],[2,52],{9:$Vq,13:$Vr,48:$Vt,49:$Vu,50:$Vv,51:$Vw,52:$Vx,53:$Vy,55:$Vz,56:$VA,57:$VB,58:$VC,59:$VD,60:$VE,61:$VF,62:$VG})],
defaultActions: {6:[2,1],21:[2,6],22:[2,7]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:return 5
break;
case 1:this.begin('expr'); return 24
break;
case 2:this.popState(); return 26
break;
case 3:this.popState(); return 18;
break;
case 4:this.unput('{{'); return 23;
break;
case 5:this.unput('}}'); return 23;
break;
case 6:return 23;
break;
case 7:this.begin("INITIAL"); return 11;
break;
case 8:this.begin("INITIAL"); return 13;
break;
case 9:this.unput('{{'); return 23;
break;
case 10:this.unput('}}'); return 23;
break;
case 11:return 23;
break;
case 12:/* skip whitespace */
break;
case 13:/** skip comment */
break;
case 14:return 43;
break;
case 15:return 44;
break;
case 16:return 46;
break;
case 17:return 45;
break;
case 18:return 42;
break;
case 19:return 12;
break;
case 20:this.begin('string'); return 18;
break;
case 21:return 59;
break;
case 22:return 60;
break;
case 23:return 9;
break;
case 24:return 13;
break;
case 25:return 55;
break;
case 26:return 56;
break;
case 27:return 57;
break;
case 28:return 58;
break;
case 29:return 61;
break;
case 30:return 62;
break;
case 31:return 48;
break;
case 32:return 49;
break;
case 33:return 53;
break;
case 34:return 50;
break;
case 35:return 51;
break;
case 36:return 52;
break;
case 37:return 65;
break;
case 38:return 67;
break;
case 39:return 40;
break;
case 40:return 41;
break;
case 41:return 69;
break;
case 42:return 70;
break;
case 43:return 68;
break;
case 44:return 64;
break;
case 45:return 63;
break;
case 46:return 54;
break;
case 47:return 72;
break;
case 48:return 47;
break;
case 49:return 20
break;
case 50:return 12
break;
case 51:return 11;
break;
case 52:return 13;
break;
case 53:this.begin('children'); return 9
break;
case 54:this.begin('children'); return 8
break;
case 55:return 17
break;
case 56:this.begin('string'); return 18; 
break;
case 57:return 'INVALID'
break;
}
},
rules: [/^(?:$)/,/^(?:\{\{)/,/^(?:\}\})/,/^(?:")/,/^(?:(([^"\\]|\\.)*)(?=\{)\{)/,/^(?:(([^"\\]|\\.)*)(?=\})\})/,/^(?:(([^"\\]|\\.)*))/,/^(?:<\/)/,/^(?:<)/,/^(?:(([^\<])*)(?=\{)\{)/,/^(?:(([^\<])*)(?=\})\})/,/^(?:(([^\<])*))/,/^(?:\s+)/,/^(?:(<!)(.+)(?=-)->)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:null\b)/,/^(?:undefined\b)/,/^(?:(-?[1-9]([0-9]+)?(\.[0-9]+)?))/,/^(?:([a-zA-Z]([a-zA-Z0-9]+)?))/,/^(?:")/,/^(?:>=)/,/^(?:<=)/,/^(?:>)/,/^(?:<)/,/^(?:===)/,/^(?:==)/,/^(?:!==)/,/^(?:!=)/,/^(?:&&)/,/^(?:\|\|)/,/^(?:\+)/,/^(?:-)/,/^(?:\*\*)/,/^(?:\*)/,/^(?:\/)/,/^(?:%)/,/^(?:\[)/,/^(?:\])/,/^(?:\()/,/^(?:\))/,/^(?:\{)/,/^(?:\})/,/^(?:,)/,/^(?::)/,/^(?:\?)/,/^(?:!)/,/^(?:\.\.\.)/,/^(?:\.)/,/^(?:([a-zA-Z]([a-zA-Z0-9]+)?):([a-zA-Z]([a-zA-Z0-9]+)?))/,/^(?:([a-zA-Z]([a-zA-Z0-9]+)?))/,/^(?:<\/)/,/^(?:<)/,/^(?:>)/,/^(?:\/>)/,/^(?:=)/,/^(?:")/,/^(?:.)/],
conditions: {"string":{"rules":[0,1,2,3,4,5,6,12],"inclusive":false},"children":{"rules":[0,1,2,7,8,9,10,11,12],"inclusive":false},"expr":{"rules":[0,1,2,12,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48],"inclusive":false},"INITIAL":{"rules":[0,1,2,12,13,49,50,51,52,53,54,55,56,57],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}