"use strict";

const grammar =
`Expression
  = '(' op: Operator _  arg1: Expression _ arg2: Expression ')' { return [op, arg1, arg2]; }
  / Integer

_ "whitespace"
  = [ \\t\\n\\r]*

Integer "integer"
  = [0-9]+ { return parseInt(text(), 10); }

Operator
 = "+"
 / "*"
 / "-"
`

// const parser = peg.generate(grammar);
const parser = peg.generate(grammar);

const id = x => x;
const selfApply = s => s(s);
const apply = f => x => f(x);

const selectFirst = first => second => first;

const selectSecond = first => id;

const makePair = first => second => func => func(first)(second);

const _eval = (expr) => {
  if (Array.isArray(expr)) {
    const operator = expr[0];
    const args = expr.slice(1).map(arg => _eval(arg));
    switch (operator) {
      case '+':
        return args[0] + args[1];
        break;
      case '*':
        return args[0] * args[1];
      case '-':
        return args[0] - args[1];
      default:
        return undefined;
    }
  } else if (!isNaN(expr)) {
    return expr;
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
