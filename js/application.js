var operators = ["+"];
var maxN = 10;
var result = 4;
var score = 0, hscore = 0, tscore = 0;
var gameTime = 10000; // How much time the game lasts in ms
var secondsLeft = 10;
var now, end;

var randomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var generateProblem = function () {
	var operator = operators[randomInt(0, operators.length - 1)];
	
	var num1 = 1, num2 = 1;
	
	if (operator === "/") {
		num2 = randomInt(1, maxN)
		num1 = num2 * randomInt(1, Math.floor(maxN/num2));
	} else {
		num1 = randomInt(1, maxN);
		if (operator === "-") {
			num2 = randomInt(1, num1);
		} else {
			num2 = randomInt(1, maxN);
		}
	}
	
	$("#problem").html(num1 + " " + operator + " " + num2);
	
	switch (operator) {
		case "+":
			result = num1 + num2;
			break;
		case "-":
			result = num1 - num2;
			break;
		case "*":
			result = num1 * num2;
			break;
		case "/":
			result = num1 / num2;
			break;
	}
}

var updateMaxNum = function() {
	maxN = $("#maxNumR").val();
	$("#maxNum").html(maxN);
}

var addOperator = function (op) {
	operators.push(op);
}

var removeOperator = function (op) {
	opIndex = operators.indexOf(op)
	operators = operators.slice(0,opIndex).concat(operators.slice(opIndex+1));
}

var interval;
var startCountdown = function () {
	$("#instructions").hide();
	$(".controls").addClass("disabledControls");
	now = new Date().getTime();
	end = now + gameTime;
	interval = window.setInterval(checkTimeLeft, 100);
}

var gameEnds = function () {
	$("#timeLeft").html("10.0");
	$("#answer").val("");
	$(".controls").removeClass("disabledControls");
	
	if (score > hscore) {
		hscore = score;
		$("#hscore").html(hscore);
	}
	tscore += score;
	$("#tscore").html(tscore);
	
	generateProblem();
	
	$("#answer").prop("disabled", true);
	setTimeout(function () {
		$("#answer").prop("disabled", false);
		$("#score").html("0");
	}, 1000);
	
	$("#instructions").html("Good job! You made <b>" + score + " points!</b> Want to try again?")
	$("#instructions").show(1000);
	score = 0;
	
	window.clearInterval(interval);
	interval = null;
}

var checkTimeLeft = function() {
	now = new Date().getTime();
	
	var deltaT = end - now;
	
	if (deltaT <= 0) {
		gameEnds();
	} else {
		secondsLeft = deltaT/1000;
		$("#timeLeft").html(secondsLeft.toFixed(1));
	}
}


$(document).ready(function () {
	$('#maxNumR').on('change mousemove', function (event) {
		updateMaxNum();
	});
	
	$(document).on('change', 'input[type="checkbox"]', function (event) {
		var selectedOperator = this.getAttribute("data_operator");
		if (this.checked) {
			addOperator(selectedOperator);
			if (operators.length === 2) {
				$(this).siblings("[disabled]").prop("disabled", false);
			}	
		} else {
			removeOperator(selectedOperator);
			if (operators.length === 1) {
				$(this).siblings(":checked").prop("disabled", true);
			}	
		}
		console.log(operators);
	});
	
	var timeout;
	$('#answer').on('input', function () {
		if (!interval) {
			startCountdown();
		}
		clearTimeout(timeout);
		timeout = setTimeout(function () {
			if ($('#answer').val() == result) {
				score++;
				$("#score").html(score);
				$('#answer').val("");
				generateProblem();
			}
		}, 100);
	});
	
	generateProblem();
	
});