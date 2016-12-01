"use strict";

const grammar =
`
Expression "expression"
  = Condition
  / Application
  / Lambda
  / Binding
  / Integer
  / String
  / Identifier
  / '(' expr: Expression ')' { return expr; }

_ "whitespace"
  = [ \\t\\n\\r]*

Integer "integer"
  = [0-9]+ {
    return { type: 'literal',
             literalType: 'Integer',
             value: parseInt(text(), 10)
          };
  }

String "string"
 = '\"' value: ([^\"]* { return text(); } ) '\"' {
   return { type: 'literal',
            literalType: 'String',
            value: value
          };
    }

Letter
  = [a-zA-Z]

Identifier
  = (Letter / '+' / '-' / '*' / '/' / '_' / '==' / '>' / '<')+ {
  	return {
    	type: 'identifier',
        value: text()
    }
  }

Application
  = id: Identifier _ args: ActualArguments {
     return { type: 'application',
            fun: id,
            args: args
          }
  }
  / lambda: ('(' l: Lambda ')' { return l; }) _ args: ActualArguments  {
     return { type: 'application',
            fun: lambda,
            args: args
          }
    }

ActualArguments
 = expr: Expression rest: (',' _ e: Expression { return e })* { return [expr].concat(rest); }

Lambda
  = '\\\\' args: Arguments _ '->' _ body: Expression {
   return { type: 'lambda',
            args: args,
            body: body
          }
    }

Arguments
  = head: Identifier rest: (',' _ i: Identifier { return i; })* { return [head].concat(rest); }

Binding
 = name: Identifier _ '=' _ def: Expression _ 'in' _ expr: Expression {
   return {
     type: 'binding',
     name: name,
     def: def,
     expr: expr
   }
 }

Condition
 = 'if' _ '(' _ cond: Expression _ ')' _ '{' _ expr1: Expression _ '}' expr2: ( _ 'else' _ '{' _ e: Expression _ '}' { return e; })? {
   return {
     type: 'condition',
     condition: cond,
     expr1,
     expr2
   }
 }
`

// const parser = peg.generate(grammar);
const parser = peg.generate(grammar);

const std = {
  '+': (arg1, arg2) => arg1 + arg2,
  '-': (arg1, arg2) => arg1 - arg2,
  '*': (arg1, arg2) => arg1 * arg2,
  '/': (arg1, arg2) => arg1 / arg2,
  'str': (arg1, arg2) => [arg1, arg2].join(""),
  '>': (arg1, arg2) => arg1 > arg2,
  '<': (arg1, arg2) => arg1 < arg2,
  '==': (arg1, arg2) => arg1 === arg2,
  'false': false,
  'true': true,
  'and': (arg1, arg2) => arg1 && arg2,
  'or': (arg1, arg2) => arg1 || arg2
}

const makeLambda = (fun, parentEnv) => {
  return (...args) => {
      const env = Object.assign({}, parentEnv);
      fun.args.forEach((el, i) => {
        env[el.value] = args[i];
      });
      return _eval(fun.body, env);
  }
}

const evalLiteral = (literal) => {
  switch (literal.literalType) {
    case 'Integer':
      return parseInt(literal.value);
    case 'String':
      return String(literal.value);
    default:
      console.log('Literal type undefined');
      return literal.value;
  }
}

const _eval = (expr, parentEnv = std) => {
  const env = Object.assign({}, parentEnv);
  switch (expr.type) {
    case 'application':
      const fun = _eval(expr.fun, env);
      const args = expr.args.map(arg => _eval(arg, env));
      return fun.apply(null, args);
      break;
    case 'literal':
      return evalLiteral(expr);
    case 'identifier':
      return env[expr.value];
    case 'lambda':
      return makeLambda(expr, env);
    case 'binding':
      env[expr.name.value] = _eval(expr.def, env);
      return _eval(expr.expr, env);
    case 'condition':
      if (_eval(expr.condition, env)) {
        return _eval(expr.expr1, env);
      } else {
        return _eval(expr.expr2, env);
      }
  }
}

const parseAndEval = (str) => {
  try {
    const parsed = parser.parse(str);
    console.log(parsed);
    return _eval(parsed);
  } catch (e) {
    if (e.name == "SyntaxError" ) {
    return e.toString() +
      " start: " + JSON.stringify(e.location.start) +
      " end: " + JSON.stringify(e.location.end);
    } else {
      return e.toString();
    }
  }
}
