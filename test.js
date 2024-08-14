Qualtrics.SurveyEngine.addOnload(function() {
    // Hide back button
    this.hidePreviousButton();
	
	// Loop index
	var loopIndex = "${lm://CurrentLoopNumber}";
    
    // Increment the guessing task counter
    var guessing_task_counter = parseInt("${e://Field/guessing_task_counter}");
    
    // Display the guessing task counter
    var guessingTaskContainer = document.createElement('div');
    guessingTaskContainer.innerHTML = "<strong><u>Part 2: Guessing Task " + guessing_task_counter + "</u></strong>";
    document.getElementById('guessing-task-container').appendChild(guessingTaskContainer);
    
    // Save the updated guessing task counter as embedded data
    Qualtrics.SurveyEngine.setEmbeddedData('guessing_task_text', "Guessing Task " + guessing_task_counter);
    Qualtrics.SurveyEngine.setEmbeddedData('guessing_task_counter', guessing_task_counter);

    // Retrieve the values from the embedded data fields
    var incent_belief = "${lm://Field/12}";
    var true_belief = "${lm://Field/13}";
    var bias = "${lm://Field/14}";

    // Function to parse the string and return an object with sender_id as keys and values
    function parseStringToObj(str) {
        var result = {};
        var pairs = str.split(',');
        pairs.forEach(function(pair) {
            var parts = pair.split(':');
            if (parts.length === 2) {
                var sender_id = parts[0].trim();
                var value = parseFloat(parts[1].trim());
                result[sender_id] = value;
            }
        });
        return result;
    }

    // Parse the strings into objects
    var incentObj = parseStringToObj(incent_belief);
    var trueObj = parseStringToObj(true_belief);
    var biasObj = parseStringToObj(bias);

    // Choose a sender_id (example: choose the first one from incentObj)
    var sender_id = Object.keys(incentObj)[0];

    // Get the values for the chosen sender_id from each variable
    var incent_value = incentObj[sender_id];
    var true_value = trueObj[sender_id];
    var bias_value = biasObj[sender_id];

    // Save the sender_id and values as embedded data
    Qualtrics.SurveyEngine.setEmbeddedData("sender_id_" + loopIndex, sender_id);
    Qualtrics.SurveyEngine.setEmbeddedData("sender_incent_belief_" + loopIndex, incent_value);
    Qualtrics.SurveyEngine.setEmbeddedData("sender_true_belief_" + loopIndex, true_value);
    Qualtrics.SurveyEngine.setEmbeddedData("sender_bias_" + loopIndex, bias_value);

    // Determine if the estimate was overestimated, underestimated, or accurately estimated based on bias
    var estimation_status = (bias_value > 0) ? "overestimated" :
                            (bias_value < 0) ? "underestimated" : "accurately estimated";

    // Determine the appropriate figure link based on bias_value
    var figure_link;
    switch (bias_value) {
        case -10:
            figure_link = "https://www.dropbox.com/scl/fi/pi1b7i4tm0o5fg4qql0ob/sender_incentives_graph_m10.png?rlkey=b32cox0ykk3lg2m7czo1zen60&st=ec0tj8qz&raw=1";
            break;
        case -5:
            figure_link = "https://www.dropbox.com/scl/fi/i0m5se4hhbhudy9vdzjtd/sender_incentives_graph_m5.png?rlkey=c2j4i92onnlp585yxhuqj166q&st=lhq76olj&raw=1";
            break;
        case -1:
            figure_link = "https://www.dropbox.com/scl/fi/00kjz2bk9j7kdzapcu1vh/sender_incentives_graph_m1.png?rlkey=mmg4gflb87zatvrtkit6btkbj&st=bqoql4rx&raw=1";
            break;
        case 0:
            figure_link = "https://www.dropbox.com/scl/fi/j5sitnmmhf0kylxzhc5mb/sender_incentives_graph_0.png?rlkey=ennb3i3sfezdf6ulsobjp2axp&st=b2b64ncc&raw=1";
            break;
        case 1:
            figure_link = "https://www.dropbox.com/scl/fi/ue7tv2fmn65v8j8smp497/sender_incentives_graph_p1.png?rlkey=dpx8rwqt2ezoqzfqxv3byy9sf&st=84jah5zg&raw=1";
            break;
        case 5:
            figure_link = "https://www.dropbox.com/scl/fi/rvlnxmqxfwzql66vpyys9/sender_incentives_graph_p5.png?rlkey=qhpepyfnyasgmvly76x6njdxv&st=ozqiumq5&raw=1";
            break;
        case 10:
            figure_link = "https://www.dropbox.com/scl/fi/62ley73xn5dwdwu9m77s2/sender_incentives_graph_p10.png?rlkey=c1m0rq0ftks3d7j3t017mxg7t&st=nw3jq90y&raw=1";
            break;
        default:
            console.log("Bias value does not match any case.");
            figure_link = ""; // Default to no image if bias is not matched
    }

    // Generate the HTML content
    var bias_text = (bias_value !== 0) ? " by " + Math.abs(bias_value) + "%</strong>" : "</strong>";
    var htmlContent = 
        '<p>Here\'s another participant\'s estimate for this question:</p>' +
        '<div style="border: 2px solid #000; padding: 10px; margin: 10px 0;">' +
        '<p style="font-weight: bold;">There is a ' + (100 * incent_value) + '% likelihood that the balls were drawn from Bag A.</p>' +
        '</div>' +
        '<p>Their incentives for this information: <strong>They were paid extra if this estimate was ' + estimation_status + bias_text + '.</p>' // +  (figure_link ? '<img src="' + figure_link + '" alt="Incentives Graph">' : ''); // for now taking out the photos

    // Clear any previous content and append the new HTML content to the question text
    var questionTextContainer = jQuery("#dynamic-content");
    questionTextContainer.html(''); // Clear previous content
    questionTextContainer.append(htmlContent); // Append new content

    // Append the response input at the end
    var inputTextElement = jQuery("#" + this.questionId + " .InputText");
    inputTextElement.css({
        "width": "8%",
        "font-size": "24px" // Adjust the font size of the input box if needed
    });

    inputTextElement.before('<span class="custom-text">I believe it is </span>');
    inputTextElement.after('<span class="custom-text"> % likely that Bag A was drawn.</span>');

    // Increase the font size of the surrounding text
    jQuery("#" + this.questionId + " .custom-text").css({
        "font-size": "24px" // Adjust the font size as needed
    });

    // Log the results to the console
    console.log("Incent Belief Object:", incentObj);
    console.log("True Belief Object:", trueObj);
    console.log("Bias Object:", biasObj);
    console.log("Chosen Sender ID:", sender_id);
    console.log("Incent Belief:", incent_value);
    console.log("True Belief:", true_value);
    console.log("Bias:", bias_value);
});