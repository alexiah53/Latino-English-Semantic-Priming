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
   
 // WORDS SLIDE
   slides.words = slide({
   	  name: "words",
       start: function() {
 		  exp.allow_key_press = 0;
 		  console.log("exp.allow_key_press", exp.allow_key_press)
 		  $(".err").hide();
       },

       // handle click on "Continue" button
       button_follow_up: function() {
		  
 		  var check_words_race1 = document.querySelectorAll('[name="words_race_speaker1"]:checked');
 		  var check_words_race2 = document.querySelectorAll('[name="words_race_speaker2"]:checked');


 		  if  (!$("#speaker_1_reaction_1").val() |
 			  !$("#speaker_1_reaction_2").val() |
 			  !$("#speaker_1_reaction_3").val() |
 		  	  !$("#speaker_1_reaction_4").val() |
 			  !$("#speaker_1_reaction_5").val() |
 			  !$("#speaker_2_reaction_1").val() |
 			  !$("#speaker_2_reaction_2").val() |
 			  !$("#speaker_2_reaction_3").val() |
 		  	  !$("#speaker_2_reaction_4").val() |
 		 	  !$("#speaker_2_reaction_5").val() |
 			  !$("#accentedness_speaker1").val() |
 		  !$("#accentedness_speaker2").val() |
 			  check_words_race1.length < 1 |
 		  check_words_race2.length < 1 ) {

 		  	$(".err").show();
 		}
 			// else {
 			// 	            this.log_responses();
 			// 	            exp.go(); //use exp.go() if and only if there is no "present"ed data, ie no list of stimuli.
 			// }
 			//       },
	  
	  
 			else {
				
 				var words_race_speaker1 = document.querySelectorAll('[name="words_race_speaker1"]:checked');
 				exp.words_race_speaker1_list = [];
 				for (var i = 0; i < words_race_speaker1.length; i++) {
 					if (words_race_speaker1[i].type=="checkbox" && words_race_speaker1[i].checked == true){
 						exp.words_race_speaker1_list += words_race_speaker1[i].value+", \n";
 					}
 				}
					
 				var words_race_speaker2 = document.querySelectorAll('[name="words_race_speaker2"]:checked');
 				exp.words_race_speaker2_list = [];
 				for (var i = 0; i < words_race_speaker2.length; i++) {
 					if (words_race_speaker2[i].type=="checkbox" && words_race_speaker2[i].checked == true){
 							exp.words_race_speaker2_list += words_race_speaker2[i].value+", \n";
 						}		
 				}
 				this.log_responses();
 				exp.go();
 			}
			
 				},
	  
       // save response
       log_responses: function() {
         exp.data_trials.push({
      	  	
 			speaker_1_accentedness: $("#accentedness_speaker1").val(),
 			speaker_2_accentedness:$("#accentedness_speaker2").val(),
 			speaker_1_reaction_1:$("#speaker_1_reaction_1").val(),
 			speaker_1_reaction_2:$("#speaker_1_reaction_2").val(),
 			speaker_1_reaction_3:$("#speaker_1_reaction_3").val(),
 			speaker_1_reaction_4:$("#speaker_1_reaction_4").val(),
 			speaker_1_reaction_5:$("#speaker_1_reaction_5").val(),
 			speaker_2_reaction_1:$("#speaker_2_reaction_1").val(),
 			speaker_2_reaction_2:$("#speaker_2_reaction_2").val(),
   			speaker_2_reaction_3:$("#speaker_2_reaction_3").val(),
 			speaker_2_reaction_4:$("#speaker_2_reaction_4").val(),
 			speaker_2_reaction_5:$("#speaker_2_reaction_5").val(),
 			speaker_1_race_words: exp.words_race_speaker1_list,
 			speaker_2_race_words: exp.words_race_speaker2_list
			
         });
   	  }
   });
   
   
   

// SENTENCES SLIDE
  slides.sentences = slide({
  	  name: "sentences",
      start: function() {
		  exp.allow_key_press = 0;
		  console.log("exp.allow_key_press", exp.allow_key_press)
		  $(".err").hide();
      },

      // handle click on "Continue" button
      button_follow_up: function() {
		  
		  var check_senteces_race1 = document.querySelectorAll('[name="sentences_race_speaker1"]:checked');
		  var check_senteces_race2 = document.querySelectorAll('[name="sentences_race_speaker2"]:checked');


		  if  (!$("#speaker_1_reaction_1").val() |
			  !$("#speaker_1_reaction_2").val() |
			  !$("#speaker_1_reaction_3").val() |
		  	  !$("#speaker_1_reaction_4").val() |
			  !$("#speaker_1_reaction_5").val() |
			  !$("#speaker_2_reaction_1").val() |
			  !$("#speaker_2_reaction_2").val() |
			  !$("#speaker_2_reaction_3").val() |
		  	  !$("#speaker_2_reaction_4").val() |
		 	  !$("#speaker_2_reaction_5").val() |
			  !$("#accentedness_speaker1").val() |
		  !$("#accentedness_speaker2").val() |
			  check_senteces_race1.length < 1 |
		  check_senteces_race2.length < 1 ) {

		  	$(".err").show();
		}
			// else {
			// 	            this.log_responses();
			// 	            exp.go(); //use exp.go() if and only if there is no "present"ed data, ie no list of stimuli.
			// }
			//       },
	  
	  
			else {
				
				var senteces_race_speaker1 = document.querySelectorAll('[name="sentences_race_speaker1"]:checked');
				exp.senteces_race_speaker1_list = [];
				for (var i = 0; i < senteces_race_speaker1.length; i++) {
					if (senteces_race_speaker1[i].type=="checkbox" && senteces_race_speaker1[i].checked == true){
						exp.senteces_race_speaker1_list += senteces_race_speaker1[i].value+", \n";
					}
				}
					
				var senteces_race_speaker2 = document.querySelectorAll('[name="sentences_race_speaker2"]:checked');
				exp.sentences_race_speaker2_list = [];
				for (var i = 0; i < senteces_race_speaker2.length; i++) {
					if (senteces_race_speaker2[i].type=="checkbox" && senteces_race_speaker2[i].checked == true){
							exp.senteces_race_speaker2_list += senteces_race_speaker2[i].value+", \n";
						}		
				}
				this.log_responses();
				exp.go();
			}
			
				},
	  
      // save response
      log_responses: function() {
        exp.data_trials.push({
      	  	
			speaker_1_accentedness: $("#accentedness_speaker1").val(),
			speaker_2_accentedness:$("#accentedness_speaker2").val(),
			speaker_1_reaction_1:$("#speaker_1_reaction_1").val(),
			speaker_1_reaction_2:$("#speaker_1_reaction_2").val(),
			speaker_1_reaction_3:$("#speaker_1_reaction_3").val(),
			speaker_1_reaction_4:$("#speaker_1_reaction_4").val(),
			speaker_1_reaction_5:$("#speaker_1_reaction_5").val(),
			speaker_2_reaction_1:$("#speaker_2_reaction_1").val(),
			speaker_2_reaction_2:$("#speaker_2_reaction_2").val(),
  			speaker_2_reaction_3:$("#speaker_2_reaction_3").val(),
			speaker_2_reaction_4:$("#speaker_2_reaction_4").val(),
			speaker_2_reaction_5:$("#speaker_2_reaction_5").val(),
			speaker_1_race_sentences: exp.senteces_race_speaker1_list,
			speaker_2_race_sentences: exp.senteces_race_speaker2_list
			
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
	"words",
	"sentences",
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
