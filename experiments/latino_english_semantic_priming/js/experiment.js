// set up experiment logic for each slide
function make_slides(f) {
  var slides = {};

  // set up initial slide
  slides.i0 = slide({
    name: "i0",
    start: function() {
      exp.startT = Date.now();
    }
  });

// sound check
  slides.sound_test = slide({
     name: "sound_test",
     soundtest_OK : function(e){
       exp.trial_no = 0;
       exp.go();
     }
   });

  // set up slide with instructions for main experiment
  slides.startExp = slide({
    name: "startExp",
    start: function() {
    },
    button: function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    },
  });

  slides.trial = slide({
    name: "trial",

    // To rotate through stimulus list, comment out the above 7 lines and  uncomment the following 2:
    present: exp.stimuli,
    present_handle : function(stim) {

allow_key_press = 0

      // store stimulus data
      this.stim = stim;
	  
// this connects to html file
var prime_aud = document.getElementById("prime_stim"); 

// this indexes to the prime file name
var prime_source = stim.Prime_Voice + "_" + stim.Prime
console.log(prime_source);
prime_aud.src = "audio/" + prime_source + ".wav"; 
prime_aud.load();
prime_aud.play();


// this connects to html file
var target_aud = document.getElementById("target_stim"); 

// this indexes to the target file name
var target_source = stim.Target_Voice + "_" + stim.Target
console.log(target_source);
target_aud.src = "audio/" + target_source + ".wav"; 
target_aud.load();

prime_aud.onended = function() { 
	console.log("audio ended");
	setTimeout(function(){ 
		console.log("waiting to play target");
		target_aud.play(); 
		allow_key_press = 1;
	 }, 500);
	 
	 document.onkeydown = checkKey; 
	 function checkKey(e) { 
		 e = e || window.event;
		 if (e.keyCode == 74 && allow_key_press == 1)
			  console.log("j pressed");
		 if (e.keyCode == 70 && allow_key_press == 1)
			  console.log("f pressed");	  
	 }
	 
};
	

      $(".err").hide();

    },

    // handle click on "Continue" button
    button: function() {
        this.log_responses();
        // exp.go(); //use exp.go() if and only if there is no "present"ed data, ie no list of stimuli.
        _stream.apply(this); //use _stream.apply(this) if there is a list of "present" stimuli to rotate through
    
    },

    // save response
    log_responses: function() {
      exp.data_trials.push({
		  
    "Pair_Number": this.stim.Pair_Number,
	"List": this.stim.List,	  
    "Prime": this.stim.Prime,
    "Target": this.stim.Target,
    "Semantically":this.stim.Semantically,
	"Trial_Type": this.stim.Trial_Type,
	"Target_Word": this.stim.Target_Word,
	"Prime_Voice": this.stim.Prime_Voice,
	"Target_Voice": this.stim.Target_Voice
      });
    },
  });

  // slide to collect subject information
  slides.subj_info = slide({
    name: "subj_info",
    submit: function(e) {
      exp.subj_data = {
        language: $("#language").val(),
        enjoyment: $("#enjoyment").val(),
        asses: $('input[name="assess"]:checked').val(),
        age: $("#age").val(),
        gender: $("#gender").val(),
        education: $("#education").val(),
        fairprice: $("#fairprice").val(),
        comments: $("#comments").val()
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  // 
  slides.thanks = slide({
    name: "thanks",
    start: function() {
      exp.data = {
        "trials": exp.data_trials,
        "catch_trials": exp.catch_trials,
        "system": exp.system,
        "condition": exp.condition,
        "subject_information": exp.subj_data,
        "time_in_minutes": (Date.now() - exp.startT) / 60000
      };
      proliferate.submit(exp.data);
    }
  });

  return slides;
}

/// initialize experiment
function init() {

  exp.trials = [];
  exp.catch_trials = [];
  exp.conditions = _.shuffle(["1_ME","1_CE","1_GE","2_ME","2_CE","2_GE"]);
  exp.participant_condition = exp.conditions.pop()
  
  if (exp.participant_condition == "1_ME") {
  	var stimuli = all_stims_1_ME
  } else if (exp.participant_condition == "1_CE") {
  	var stimuli = all_stims_1_CE
  } else if (exp.participant_condition == "1_GE") {
  	var stimuli = all_stims_1_GE
  } else if (exp.participant_condition == "2_ME") {
  	var stimuli = all_stims_2_ME
  } else if (exp.participant_condition == "2_CE") {
  	var stimuli = all_stims_2_CE
  } else {
  	var stimuli = all_stims_2_GE
  }
  
  // var stimuli = all_stims;

  exp.stimuli = _.shuffle(stimuli); //call _.shuffle(stimuli) to randomize the order;
  
  console.log(exp.stimuli)
  exp.n_trials = exp.stimuli.length;



  // exp.condition = _.sample(["context", "no-context"]); //can randomize between subjects conditions here
  
  exp.system = {
    Browser: BrowserDetect.browser,
    OS: BrowserDetect.OS,
    screenH: screen.height,
    screenUH: exp.height,
    screenW: screen.width,
    screenUW: exp.width
  };

  //blocks of the experiment:
  exp.structure = [
    "i0",
	"sound_test",
    "startExp",
    "trial",
    "subj_info",
    "thanks"
  ];

  exp.data_trials = [];

  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length();
  //this does not work if there are stacks of stims (but does work for an experiment with this structure)
  //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  $("#start_button").click(function() {
    exp.go();
  });

  exp.go(); //show first slide
}
