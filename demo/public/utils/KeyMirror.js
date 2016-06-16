'use strict'

export default function keyMirror(...args) {
    let mirrored = {}

    for (let one of args) {
        mirrored[one] = one
    }

    return mirrored
}