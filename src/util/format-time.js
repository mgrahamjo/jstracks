export default time => {

    const minutes = parseInt(time / 60),
        seconds = parseInt(time - minutes * 60),
        sSpacer = seconds < 10 ? '0' : '';

    return `${minutes}:${sSpacer}${seconds}`;

};
