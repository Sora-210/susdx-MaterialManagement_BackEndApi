const paddingZero = (n: Number):String => {
    return n > 10 ? n.toString() : "0" + n.toString();
}

export {
    paddingZero
}