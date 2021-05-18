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

// SOUND CHECK

  slides.sound_test = slide({
     name: "sound_test",
	  start: function(){
	  	$('.err').hide();
	  },
     soundtest_OK : function(e){
       exp.trial_no = 0;

	   var sound_test = $(".sound_test").val();
	   sound_test = sound_test.toLowerCase();

	   if (sound_test == "ready") {
	   	 exp.go();
	   } else {
	   	$('.err').show();
	   }
     }
   });

  // INSTRUCTIONS FOR PRACTICE TRIALS

  slides.practice_instructions = slide({
    name: "practice_instructions",
    start: function() {
    },
    button: function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    },
  });

   // PRACTICE TRIAL 1

  slides.practice_trial_1 = slide({
    name: "practice_trial_1",

    // To rotate through stimulus list
    start : function()
	 {
		$('.err').hide();
		$('.correct').hide();
		exp.allow_key_press = 0;
		exp.response = "";

// this connects to html file
var prime_aud = document.getElementById("prime_stim");

// this indexes to the prime file name
prime_aud.src = "audio/doctor.wav";
prime_aud.load();
prime_aud.play();


// this connects to html file
var target_aud = document.getElementById("target_stim");

// this indexes to the target file name
target_aud.src = "audio/nurse.wav";
target_aud.load();

prime_aud.onended = function() {
	console.log("audio ended");
	setTimeout(function(){
		console.log("waiting to play target");
		target_aud.play();
		exp.allow_key_press = 1;
	 }, 500);

	 document.onkeydown = checkKey;
	 function checkKey(e) {
		 e = e || window.event;
		 if (e.keyCode == 76 && exp.allow_key_press == 1) {
		 	 console.log("L pressed");
			 exp.response = "real";
			 $('.err').hide();
			 $('.correct').show();
		 	setTimeout(function(){
				// WHEN I ADD NEW PRACTICE THIS TURNS INTO EXP.GO()
				 exp.go();
		 	 }, 2000);
		 } if (e.keyCode == 83 && exp.allow_key_press == 1) {
		 	console.log("S pressed");
			exp.response = "pseudo";
			$('.err').show();
		 }
	 }

 };
     },

     // handle click on "Continue" button
     button: function() {
         this.log_responses();
     },

     // save response
     log_responses: function() {
       exp.data_trials.push({

 	"Response_Time": 0,
 	"Response": "",
    "Pair_Number": "",
 	"List": "",
	"Prime": "doctor",
    "Target": "nurse",
	"Semantically": "related",
 	"Trial_Type": "practice",
 	"Target_Word_Type": "real",
 	"Prime_Voice": "",
	"Target_Voice": "",
	"slide_number_in_experiment": exp.phase

       });
     },
   });

    // PRACTICE TRIAL 2

   slides.practice_trial_2 = slide({
     name: "practice_trial_2",

     // To rotate through stimulus list
     start : function()
 	 {
		 // IS THIS RIGHT
		$('#stimuli').show();
		$('.err').hide();
 		$('.correct').hide();
 		exp.allow_key_press = 0;
 		exp.response = "";

 // this connects to html file
 var prime_aud = document.getElementById("prime_stim");

 // this indexes to the prime file name
 prime_aud.src = "audio/doctor.wav";
 prime_aud.load();
 prime_aud.play();


 // this connects to html file
 var target_aud = document.getElementById("target_stim");

 // this indexes to the target file name
 target_aud.src = "audio/wug.wav";
 target_aud.load();

 prime_aud.onended = function() {
 	console.log("audio ended");
 	setTimeout(function(){
 		console.log("waiting to play target");
 		target_aud.play();
 		exp.allow_key_press = 1;
 	 }, 500);

 	 document.onkeydown = checkKey;
 	 function checkKey(e) {
 		 e = e || window.event;
 		 if (e.keyCode == 76 && exp.allow_key_press == 1) {
 		 	 console.log("L pressed");
 			 exp.response = "real";
 			 $('.err').show();
 		 } if (e.keyCode == 83 && exp.allow_key_press == 1) {
 		 	console.log("S pressed");
 			exp.response = "pseudo";
 			$('.err').hide();
			$('.correct').show();
 		 	setTimeout(function(){
				exp.go();
 		 	 }, 2000);
 		 }
 	 }

  };
      },

      // handle click on "Continue" button
      button: function() {
          this.log_responses();
          // exp.go(); //use exp.go() if and only if there is no "present"ed data, ie no list of stimuli.
      },

      // save response
      log_responses: function() {
        exp.data_trials.push({

  	"Response_Time": 0,
  	"Response": "",
     "Pair_Number": "",
  	"List": "",
 	"Prime": "doctor",
     "Target": "wug",
 	"Semantically": "unrelated",
  	"Trial_Type": "practice",
  	"Target_Word_Type": "pseudo",
  	"Prime_Voice": "",
 	"Target_Voice": "",
 	"slide_number_in_experiment": exp.phase

        });
      },
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

// MAIN TRIAL

  slides.trial = slide({
    name: "trial",

    // To rotate through stimulus list, comment out the above 7 lines and  uncomment the following 2:
    present: exp.stimuli,
    present_handle : function(stim)
	 {
		exp.allow_key_press = 0;
		exp.response = null;

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
	console.log("prime audio ended");
	my_time = setTimeout(function(){
		console.log("waiting to play target");
		target_aud.play();
		exp.startTime = Date.now();
		exp.allow_key_press = 1;
	 }, 500);

   var my_time;

   	 target_aud.onended = function() {
   	 	console.log("target audio ended");
   	 	my_time = setTimeout(function(){
    		 		console.log("waiting to play next pair");
    		 		// move to next trial
           if (exp.response == null) {
               console.log("No response");
   					 	exp.response_time = Date.now() - exp.startTime
   					 	exp.response = "skip";
   					 	_s.button();
   					 	console.log("should skip to next trial")
   				}
         }, 3000);
   	 },

   	 document.onkeydown = checkKey;
   	 function checkKey(e) {
   		 e = e || window.event;
   		 if (e.keyCode == 76 && exp.allow_key_press == 1) {
   		 	 console.log("L pressed");
   			 exp.response_time = Date.now() - exp.startTime
   			 exp.response = "real";
 			var real_text_var = document.getElementById("real_text");
 			real_text_var.classList.add("active_bold");
 			console.log('check:', real_text_var.className);
   			 setTimeout(function(){
            clearTimeout(my_time);
   			 	_s.button();
   		 	}, 1000);
   		 } if (e.keyCode == 83 && exp.allow_key_press == 1) {
   		 	console.log("S pressed");
   			exp.response_time = Date.now() - exp.startTime
   			exp.response = "pseudo";
			var pseudo_text_var = document.getElementById("pseudo_text");
			pseudo_text_var.classList.add("active_bold");
			console.log('check:', pseudo_text_var.className);
   		 	setTimeout(function(){
           clearTimeout(my_time);
   				_s.button();
   	 	   }, 1000);
   		 }
   	 }

};
      $(".err").hide();
    },

    // handle click on "Continue" button
    button: function() {
		// exp.prime_source = "";
		// exp.target_source = "";
        this.log_responses();
		var pseudo_text_var = document.getElementById("pseudo_text");
		var real_text_var = document.getElementById("real_text");
		pseudo_text_var.classList.remove("active_bold");
		real_text_var.classList.remove("active_bold");
        _stream.apply(this); //use _stream.apply(this) if there is a list of "present" stimuli to rotate through
		$('#stimuli').show();
        // exp.go(); //use exp.go() if and only if there is no "present"ed data, ie no list of stimuli.
		// $('#stimuli').hide();
		// $('#landing_page').show();
    },

    // save response
    log_responses: function() {
      exp.data_trials.push({

	"Response_Time": exp.response_time,
	"Response": exp.response,
    "Pair_Number": this.stim.Pair_Number,
	"List": this.stim.List,
    "Prime": this.stim.Prime,
    "Target": this.stim.Target,
    "Semantically":this.stim.Semantically,
	"Trial_Type": this.stim.Trial_Type,
	"Target_Word_Type": this.stim.Target_Word_Type,
	"Prime_Voice": this.stim.Prime_Voice,
	"Target_Voice": this.stim.Target_Voice,
	"slide_number_in_experiment": exp.phase

      });
    },
  });

  slides.follow_up = slide({
  	  name: "follow_up",
      start: function() {
		  exp.allow_key_press = 0;
		  console.log("exp.allow_key_press", exp.allow_key_press)
      },

      // handle click on "Continue" button
      button_follow_up: function() {

		  if  (!$("#speaker_1_reaction_1").val() |
			  !$("#speaker_1_reaction_2").val() |
			  !$("#speaker_1_reaction_3").val() |
		  	  !$("#speaker_1_reaction_4").val() |
			  !$("#speaker_1_reaction_5").val() |
			  !$("#speaker_2_reaction_1").val() |
			  !$("#speaker_2_reaction_2").val() |
			  !$("#speaker_2_reaction_3").val() |
		  	  !$("#speaker_2_reaction_4").val() |
		 	  !$("#speaker_2_reaction_5").val()) {

		  	$(".err").show();
		}
			else {
	            this.log_responses();
	            exp.go(); //use exp.go() if and only if there is no "present"ed data, ie no list of stimuli.
			}
      },

      // save response
      log_responses: function() {
        exp.data_trials.push({
      	  	"speaker_1_reaction_1":$("#speaker_1_reaction_1").val(),
			"speaker_1_reaction_2":$("#speaker_1_reaction_2").val(),
			"speaker_1_reaction_3":$("#speaker_1_reaction_3").val(),
			"speaker_1_reaction_4":$("#speaker_1_reaction_4").val(),
			"speaker_1_reaction_5":$("#speaker_1_reaction_5").val(),
			"speaker_2_reaction_1":$("#speaker_2_reaction_1").val(),
			"speaker_2_reaction_2":$("#speaker_2_reaction_2").val(),
  			"speaker_2_reaction_3":$("#speaker_2_reaction_3").val(),
			"speaker_2_reaction_4":$("#speaker_2_reaction_4").val(),
			"speaker_2_reaction_5":$("#speaker_2_reaction_5").val(),
        });
  	  }
  });

  // slide to collect subject information
  slides.subj_info = slide({
    name: "subj_info",
    submit: function(e) {


	  if  (
		  !$("#heritage_country").val() |
		  !$("#current_region").val() |
		  !$("#first_language").val() |
		  !$("#parent_languages").val() |
	  	  !$("#exposure").val()) {

	  	$(".err").show();
	}
	else {

		var races = document.querySelectorAll('[name="race"]:checked');
		console.log("race:", races.length);

		var race_list = [];

		for (var i = 0; i < races.length; i++) {

			if (races[i].type=="checkbox" && races[i].checked == true){
				race_list += races[i].value+", \n";
			}
		}

		console.log("list:", race_list);

      exp.subj_data = {
        asses: $('input[name="assess"]:checked').val(),
        age: $("#age").val(),
        gender: $("#gender").val(),
        education: $("#education").val(),
        comments: $("#comments").val(),
		race: race_list,
		 heritage_country: $("#heritage_country").val(),
		current_region: $("#current_region").val(),
		other_regions: $("#other_regions").val(),
		first_language: $("#first_language").val(),
		other_languages: $("#other_languages").val(),
		parent_languages: $("#parent_languages").val(),
		exposure: $("#exposure").val()
      };

      exp.go();

}
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
      
	  setTimeout(function (){
	  	turk.submit(exp.data);
	  }, 1000);
    }
  });

  return slides;
}

/// initialize experiment
function init() {

  // exp.trials = [];
  // exp.catch_trials = [];
  // exp.conditions = _.shuffle(["1_ME","1_CE","1_GE","2_ME","2_CE","2_GE"]);
  // exp.participant_condition = exp.conditions.pop()
  //
  // if (exp.participant_condition == "1_ME") {
  // 	var stimuli = all_stims_1_ME
  // } else if (exp.participant_condition == "1_CE") {
  // 	var stimuli = all_stims_1_CE
  // } else if (exp.participant_condition == "1_GE") {
  // 	var stimuli = all_stims_1_GE
  // } else if (exp.participant_condition == "2_ME") {
  // 	var stimuli = all_stims_2_ME
  // } else if (exp.participant_condition == "2_CE") {
  // 	var stimuli = all_stims_2_CE
  // } else {
  // 	var stimuli = all_stims_2_GE
  // }

  var stimuli = all_stims;

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
	"practice_instructions",
	"practice_trial_1",
	"practice_trial_2",
    "startExp",
    "trial",
	"follow_up",
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

// this is for prolific
  // $("#start_button").click(function() {
  //   exp.go();
  // });

  // this is for mturk
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  exp.go(); //show first slide
}
