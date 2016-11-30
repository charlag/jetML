"use strict";

// {
//   function makeExpression(op, args) {
//     return { type: 'expression',
//              fun: op,
//              args: args
//            };
//   }
// }



const grammar =
`
Expression "expression"
  = fun: Identifier _  args: (arg:Expression _? { return arg; } )* {
    return { type: 'expression',
               fun: fun,
               args: args
             };
           }
  / '(' expr: Expression ')' { return expr; }
  / Integer

_ "whitespace"
  = [ \\t\\n\\r]*

Integer "integer"
  = [0-9]+ {
    return { type: 'literal',
             literalType: 'Integer',
             value: parseInt(text(), 10)
          };
  }

Letter
  = [a-zA-Z]

Identifier
  = (Letter / '+' / '-' / '*' / '/' / '_') { return text(); }
`;

// const parser = peg.generate(grammar);
const parser = peg.generate(grammar);

const id = x => x;
const selfApply = s => s(s);
const apply = f => x => f(x);

const selectFirst = first => second => first;

const selectSecond = first => id;

const makePair = first => second => func => func(first)(second);

const stdFunctions = {
  '+': (arg1, arg2) => arg1 + arg2,
  '-': (arg1, arg2) => arg1 - arg2,
  '*': (arg1, arg2) => arg1 * arg2,
  '/': (arg1, arg2) => arg1 / arg2,
  'str': (arg) => String(arg)
}

const _eval = (expr, env = stdFunctions) => {
  switch (expr.type) {
    case 'expression':
      const fun = env[expr.fun];
      const args = expr.args.map(arg => _eval(arg, env));
      return fun.apply(null, args)
      break;
    case 'literal':
      return expr.value;
  }
}

const parseAndEval = (str) => {
  try {
    const parsed = parser.parse(str);
    return _eval(parsed);
  } catch (e) {
    return e.toString();
  }
}
