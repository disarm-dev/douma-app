const generate_personalised_instance_id = () => {
  const vowels = ["a","e","i","o","u"]
  const consonants = ["b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","x","w","y","z"]
  let output = ''
  for (let i = 1; i <= 8; i++) {
    let character
    if(i % 2 === 0) {
      character = vowels[(Math.floor(Math.random() * vowels.length))]
    } else {
      character = consonants[(Math.floor(Math.random() * consonants.length))]
    }
    output += character
  }
  return output + '-' + new Date().getMilliseconds()
}

export {generate_personalised_instance_id}
