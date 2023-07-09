const passwordDisplay = document.querySelector("[data-passwordDislay]");
const cpyBtn = document.querySelector("[data-copy]");
const cpyMsg = document.querySelector("[data-copyMsg]");

const lenghtDisplay = document.querySelector("[data-lengthNumber]");
const inputSlider = document.querySelector("[data-lengthSlider]");

const uppercaseCheck= document.querySelector("#uppercase");
const lowercaseCheck= document.querySelector("#lowercase");
const numbersCheck= document.querySelector("#numbers");
const symbolsCheck= document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox");
const symbols = '~!@#$%^&*()_-+={}[]:/>,<.?';


// Initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength circle color is grey
setIndicator("#ccc");

// Set passwordLength
function handleSlider()
{
    inputSlider.value = passwordLength; 
    lenghtDisplay.innerText = passwordLength;
    // Add some more
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min) *100/(max - min)) + "% 100%"
}

function setIndicator(color)
{
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max)
{
   return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber()
{
    return getRandomInteger(0,9);
}

function generateLowercase()
{
   return String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperrcase()
{
   return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol()
{
    const randNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength()
{
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8)
    {
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6)
    {
        setIndicator("#ff0");
    }
    else
    {
        setIndicator("#f00");
    }
}

async function copyContent()
{
    try
    {
        await navigator.clipboard.writeText(passwordDisplay.value);
        cpyMsg.innerText = "copied";
    }
    catch(e)
    {
        cpyMsg.innerText = "Failed";
    }
    // To Make Copy wala Span Visible
    cpyMsg.classList.add("active");

    setTimeout(() =>{
        cpyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array)
{
    // Fisher yates Method
    for(let i = array.length-1; i > 0; i--)
    {
        // finding Random J using random function
        const j = Math.floor(Math.random() * (i + 1));
        // Swap arry[i] and array[j] index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange()
{
    checkCount = 0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked)
            checkCount++;
    });

    // Special Condition
    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input',(e) =>{
    passwordLength = e.target.value;
    handleSlider();
});

cpyBtn.addEventListener('click', () =>{
    if(passwordDisplay.value)
        copyContent();
});

generateBtn.addEventListener('click', () => {
    // None of the checkbox are selected
    if(checkCount == 0) 
    {
        return;
    }
    // if passwordlength less than checkcount CASE
    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }

    // Lets Start the Journey to find New Password

    console.log("Starting the Journey");
    // Remove old password
    password = "";

    // Lets put the stuff mentioned by CheckBoxes

    // if(uppercaseCheck.checked)
    // {
    //     password += generateUpperrcase();
    // }
    // if(lowercaseCheck.checked)
    // {
    //     password += generateLowercase();
    // }
    // if(numbersCheck.checked)
    // {
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked)
    // {
    //     password += generateSymbol();
    // }

    let funcArray = [];
    if(uppercaseCheck.checked)
    {
        funcArray.push(generateUpperrcase);
    }
    if(lowercaseCheck.checked)
    {
        funcArray.push(generateLowercase);
    }
    if(numbersCheck.checked)
    {
        funcArray.push(generateRandomNumber);
    }
    if(symbolsCheck.checked)
    {
        funcArray.push(generateSymbol);
    }
    // Compulsory Addition
    for(let i = 0; i < funcArray.length;i++)
    {
        password += funcArray[i]();
    }
    console.log("Compulsory addition Done");

    // Remaining Addition 
    for(let i = 0; i < passwordLength-funcArray.length;i++)
    {
        let randIndex = getRandomInteger(0, funcArray.length);
        console.log("RandIndex" + randIndex);
        password += funcArray[randIndex]();
    }
    console.log("Remaining addition Done");

    // Shuffle Password in random
    password = shufflePassword(Array.from(password));
    console.log("Shuffling Done");
    // Show in UI
    passwordDisplay.value = password;
    console.log("UI addition Done");

    // Calculate Strength
    calcStrength();

});