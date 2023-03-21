const form = document.querySelector('form');
const generateImageButton = document.querySelector('#generate-image-button');
const loadingSpinner = document.querySelector('#loading-spinner');

generateImageButton.addEventListener('click', (event) => {
  event.preventDefault(); 

  const userMessage = form.elements['user-message'].value;

  const paragraphArray = userMessage.split('\n');

  const image = new Image();
  image.crossOrigin = 'anonymous'; // Set the crossOrigin attribute to allow loading from a different domain
  image.src = 'https://i.ibb.co/GCJFvhw/Greeting-Card-Temp.jpg';

  loadingSpinner.style.visibility = 'visible';

  image.addEventListener('load', () => {

    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;


    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    const fontSize = 30; 
    const fontFamily = 'Gotham Rounded'; 
    const marginLeft = 100; 
    const lineHeight = 1.2; // Set the line height
    const textX = canvas.width / 2; 
    const textY = canvas.height - 30 - (lineHeight * fontSize); 
    context.fillStyle = '#000000'; 
    context.font = `bold ${fontSize}px ${fontFamily}`; 
    context.textAlign = 'center';
    context.textBaseline = 'bottom';

    let currentY = textY;
    for (let i = 0; i < paragraphArray.length; i++) {
      currentY = wrapText(context, paragraphArray[i], textX, currentY, canvas.width, lineHeight, fontSize, fontFamily);
      currentY += lineHeight * fontSize;
    }

    const dataUrl = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'JaGaRaya_Greeting_Card.png';

    link.click();
    loadingSpinner.style.visibility = 'hidden'; 
  });
});


function wrapText(context, text, x, y, maxWidth, lineHeight, fontSize, fontFamily) {
  context.font = `${fontSize}px ${fontFamily}`;
  let words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = context.measureText(testLine);
    let testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      context.fillText(line.trim(), x, y);
      line = words[n] + ' ';
      y += lineHeight * fontSize;
    }
    else {
      line = testLine;
    }
  }

  context.fillText(line.trim(), x, y);
}

const charCountElement = document.querySelector('#char-count');

form.elements['user-message'].addEventListener('input', () => {
  const userMessage = form.elements['user-message'].value;
  const charCount = userMessage.length;
  charCountElement.innerText = `${charCount}/90`;
});