 exports.generate6DigitsCode =  () => {
    let rawCode = (Math.random() * 1e15).toString();
    for(let i = 0; i < rawCode.length; i++){
      if(rawCode[i] != '0')
        return rawCode.substring(i,6);
    }
  };

  