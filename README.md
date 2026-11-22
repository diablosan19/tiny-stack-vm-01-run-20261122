[![make.fun](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)
[![rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/diablosan19/tiny-stack-vm-01-run-20261122/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)
[![reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/diablosan19/tiny-stack-vm-01-run-20261122/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)

# tiny-stack-vm

A tiny stack virtual machine for [make.fun](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)'s "Build a tiny stack virtual machine, 22 November 2026" bounty.

`main.ts` (Node 22, stdlib only, no dependencies) runs every `program.bin` in
the input set on the competition's tiny stack ISA: 32-bit wrapping integers, a
256-value stack, a 64-deep call stack, 256 words of memory, input and output,
and all ten traps with their own exit codes. It writes `stdout.bin` and
`exit.txt` per instance, and is fully deterministic: the same bytes on every
run.

Run: `MAKEFUN_INPUT_DIR=<input> MAKEFUN_OUTPUT_DIR=<output> node main.ts`
