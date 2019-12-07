var arr = [];
let details;
var ran = [];
var openFile = function(event) {
  var input = event.target;

  var reader = new FileReader();
  reader.onload = function() {
    details = reader.result;
  };
  reader.readAsText(input.files[0]);
};

document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elems);
});

document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems);
});
$("#chooseFile").bind("change", function() {
  var filename = $("#chooseFile").val();
  if (/^\s*$/.test(filename)) {
    $(".file-upload").removeClass("active");
    $("#noFile").text("No file chosen...");
  } else {
    $(".file-upload").addClass("active");
    $("#noFile").text(filename.replace("C:\\fakepath\\", ""));
  }
});
function submit() {
  let unit = document.getElementById("unit").value;
  let level = document.getElementById("level").value;
  if (level !== "" && unit !== "") {
    check();
    initExt();
  } else {
    alert("Enter Details");
  }
}
function check() {
  if(details == undefined) {alert("No Document found");}
  if(details.indexOf("1 Mark")==-1) {alert("No 1 Mark Section Found");}
  if(details.indexOf("5 Mark")==-1) {alert("No 5 Mark Section Found");}
  if(details.indexOf("10 Mark")==-1) {alert("No 10 Mark Section Found");}
}
function initExt() {
  extract(5, 1);
  extract(10, 5);
  extract("end", 10);
}
function extract(index, typeQ) {
  let type = ""+typeQ;
  let unit = document.getElementById("unit").value;
  let level = document.getElementById("level").value;
  let mark = details.indexOf(index + " Mark");
  let border = details.indexOf(typeQ + " Mark");
  console.log(border);
  if (mark === -1) {
    mark = details.length;
  }
  let start = details.indexOf("1.", border);
console.log(start);
  for (let i = 0; i < mark; i++) {
    let end = details.indexOf(i + 2 + ".", border);
    let strend = details.indexOf("endofquestions", border);
    if (end > strend) {
      end = strend;
    }
    if (end === -1) {
      end = strend;
    }
    let sentence = details.substring(start, end);
    if (sentence.trim().length > 1) {
      arr.push({
        question: sentence.trim(),
        type: type,
        unit: unit,
        level: level
      });
      start = end;
    }
  }
  console.log(arr);
}

var units = [];
function calcUnits() {
  document.getElementById("units").innerHTML = '';
  if(arr.length === 0) {alert("No Questions Found");}
  units = [];
  for (let i = 0; i < arr.length; i++) {
    if (units.indexOf(arr[i].unit) === -1) {
      units.push(arr[i].unit);
    }
  }
  console.log(units);
  let ux = "";
  for (let i = 0; i < units.length; i++) {
    let str = `<p>
      <label>
        <input value=${units[i]} class="selUnit" type="checkbox" />
        <span>${units[i]}</span>
      </label>
    </p>`;
    ux = ux + str;
  }
  console.log(ux);
  document.getElementById("units").insertAdjacentHTML("beforeend", ux);
}
var questions = [];
function generate() {
  if(arr.length === 0) {alert("No Questions Found");}
  let no = document.getElementById("no").value;
  let type = document.getElementById("seltype").value;
  var checkedValue = [];
  var inputElements = document.getElementsByClassName("selUnit");
  for (var i = 0; inputElements[i]; ++i) {
    if (inputElements[i].checked) {
      checkedValue.push(inputElements[i].value);
    }
  }
  if(no !== '' && type != '' && checkedValue.length!== 0) {
  console.log(seltype);
  questionsPerUnit = no / units.length;
  questions = [];
  diff = 0;
  unit = 0;
  possibleQuestions = [];
  if(type=='all') {
    for (let i = 0; i < arr.length; i++) {
        if (checkedValue.indexOf("" + arr[i].unit) !== -1) {
          possibleQuestions.push(arr[i]);
        }
      }
  }
  else {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].type === type && checkedValue.indexOf("" + arr[i].unit) !== -1) {
      possibleQuestions.push(arr[i]);
    }
  }
  }


  console.log(possibleQuestions);

  for (let i = 0; i < units.length; i++) {
    let unitQuestions = getUnitQuestion(
      possibleQuestions,
      units[unit]
    );
    questionsPerUnit = Math.floor(questionsPerUnit);
    for (let k = 0; k < questionsPerUnit; k++) {
      let diffQuestion;
      ran = [];
      for (let j = 0; j < 3; j++) {
        diffQuestion = getDiffQuestion(
          unitQuestions,
          (diff % 3) + 1,
          questions
        );
        
        diff++;
        if (diffQuestion !== undefined) {
          break;
        }
      }
      if(diffQuestion !== undefined) {
      questions.push(diffQuestion);
      }
    }

   
    unit++;
  }
  if(questions.length!==no) {
    let ext = no-questions.length;

    for(let i=0;i<ext;i++) {
    for (let j = 0; j < 3; j++) {
      diffQuestion = getDiffQuestion(
        unitQuestions,
        (diff % 3) + 1,
        questions
      );
      
      diff++;
      if (diffQuestion !== undefined) {
        break;
      }
    }
    if(diffQuestion !== undefined) {
      questions.push(diffQuestion);
      }
    }
}
  console.log(questions);
  genOutput();
} else {
  alert("Enter fields");
}
}
function getUnitQuestion(possibleQuestions, unit) {
  unitQuestions = [];
  console.log(unit);
  for (let i = 0; i < possibleQuestions.length; i++) {
    if (possibleQuestions[i].unit == unit) {
      unitQuestions.push(possibleQuestions[i]);
    }
  }
  return unitQuestions;
}
function getDiffQuestion(unitQuestions, diff, questions) {
  console.log(unitQuestions);
  let selQuestion;
  let random_number = getRandom(unitQuestions.length);
  for (let i = 0; i < unitQuestions.length; i++) {
    if (questions.length === 0 && unitQuestions[random_number].level == diff) {
    
      selQuestion = unitQuestions[random_number];
      break;
    }
    random_number = getRandom(unitQuestions.length);
    if(random_number==null) {
      ran = [];
      return selQuestion;
    }
      
    if (
      unitQuestions[random_number].level == diff &&
      questions
        .map(function(e) {
          return e.question;
        })
        .indexOf(unitQuestions[random_number].question) == -1
    ) {
      selQuestion = unitQuestions[random_number];
     // console.log(selQuestion);
      break;
    }
    
  }
  return selQuestion;
}
function genOutput() {
  document.getElementById("data").innerHTML = '';
    console.log(questions[0]);
    let ux = "";
    for (var i = 0; i < questions.length; i++) {
        if(questions[i] !== undefined) {
      let str = `<p>
        ${i+1 }  ${questions[i].question} , ${questions[i].type}, ${questions[i].level}, ${questions[i].unit}
      </p>`;
      ux = ux + str;
    }
}
    console.log(ux);
    document.getElementById("data").insertAdjacentHTML("beforeend", ux);
}

function view() {
  console.log('vies');
  for(let i=1;i<6;i++) {
    document.getElementById(`l${i}m1`).innerHTML = `<b>R</b> (${count(i,1,1)}), <b>U</b> (${count(i,1,2)}), <b>A</b> (${count(i,1,3)})`;
    document.getElementById(`l${i}m5`).innerHTML = `<b>R</b> (${count(i,5,1)}), <b>U</b> (${count(i,5,2)}), <b>A</b> (${count(i,5,3)})`;
    document.getElementById(`l${i}m10`).innerHTML = `<b>R</b> (${count(i,10,1)}), <b>U</b> (${count(i,10,2)}), <b>A</b> (${count(i,10,3)})`;
  
  }
}
function count(val, m,diff) {
  let count = 0;
  for(let i=0; i < arr.length ; i++) {
    if(arr[i].unit == val && arr[i].type == m&& arr[i].level == diff) {
      count++;
    }
  }
  return count
}

function getRandom(x) {
  if(ran.length===x) {
    return null;
  } else {
    let val = Math.floor(Math.random() * 10);
    if(ran.indexOf(val)==-1) {
      ran.push(val);
      console.log(ran);
      return val;
    } else {
      return getRandom(x);
    }
  }
}