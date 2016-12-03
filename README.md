# jetML
Functional, compact, clear

I want a functional language for JVM to make Android development better. I didn't find one I wanted.

- Clojure is great but it's dynamically typed and slow (bootstrapping and whatnot).
- Kotlin is fine but it's more of a sugar on top of Java than radically new language.
- Scala is too big and slow for Android right now.
- Fjord (F# for JVM) looked nice but I don't belive that F# can map well to JVM.
- Frege (Haskell for JVM) is truly functional. Yet, it is non-strict and requires annotations for Java code.
- OCaml for JVM wasn't updated quite a while and has structural typing which doesn't play nice with JVM infrastructure

## What I believe in

- I belive in functional programming
- I belive that static typing is better for most cases
- I belive that nominative type systems are more powerful
- I belive that dot notation for methods is evil. We're not commanding things in FP, we are *operating* on them
- I strongly belive in immutabilty. It prevents many errors, it plays nice with the concurenncy and fits in the FP.
- Language should be efficient. You shouldn't pay for immutability - we should learn from Clojure and their vectors.
- [STM](https://en.wikipedia.org/wiki/Software_transactional_memory) is a great thing
- [FRP](https://en.wikipedia.org/wiki/Functional_reactive_programming) is a great thing, we should have more of these.
- Side effect should be exceptions

## Where we are now

I've never written any compiler before so I have a lot to learn. Right now I've built a really small prototype in JS
using peg.js for parsing. It does not compile to JS but rather evaluates the AST (which is very slow). Grammar is also
pretty weak: the whole program is one expression and there are no infix operators.

What it *does* support now is one binding per expression and recursion, math and some logical operator.

So, we can calculate factorial

```
fac = \x -> if (== x, 0) { 1 } else { * x, (fac (- x, 1)) } in fac 4

24
```

## How you can help

Any help is appreciated: advices, discussions and pull requests.
What you can do is:
- Improve the grammar and deal with left recursion
- Check that closures work correctly
- Port the thing to the JVM
