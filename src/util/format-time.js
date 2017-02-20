export default time => {

    const minutes = parseInt(time / 60),
        mSpacer = minutes < 10 ? '0' : '',
        seconds = parseInt(time - minutes * 60),
        sSpacer = seconds < 10 ? '0' : '';

    return `${mSpacer}${minutes}:${sSpacer}${seconds}`;

};
