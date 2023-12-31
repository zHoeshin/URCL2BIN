# Universal URCL Compiler

This utility is a customizable compiler for [URCL](https://github.com/BramOtte/urcl-explorer).

### Short user Guide

The largest element of the website is the textbox. You have to put your URCL code into it.
<br>
To get anything from it, you use the \[Compile] button in the top left corner. Buttons around it are also self explanatory
<br>
To the right of these buttons, you can see a grid field. That's where you draw the bitmask the compiler will use.
<br>
Under it you can see more settings. You can see what they do by hovering your cursor over the text - this will give you a more full explanation.
<br>
To the right of the code input textbox you can see the table. It consists of two tabs for OPCODES and TYPES. You have to input these types in, otherwise you will get all zeroes as your compiled output.

### How does it work?

For the exact algorythm, you can read the source code. Simplifying, we can say that the algorythm is:
- Split the code string by spaces (this step is inavoidable, URCL supports string literals so using ```String.split(" ")``` if a string with a space is met would break the code)
- Go through split code line-by-line, nothing every constant (```@define literal NAME```), variable(```@define register NAME```) and label(both program pointers that tell branching and jumping instruction what PC should be and memory pointers).
A label is a memory pointer is the next instruction after it is a ```DW``` instruction
- Create abstract tree of the code, replacing constants, variables and labels with their actual values(labels still can be saved in memory as labels when compiling)
- Using bitmask, create binary representations of instructions and then combine them to get the final result