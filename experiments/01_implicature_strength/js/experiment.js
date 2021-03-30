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

  // set up the first example slide
  slides.example1 = slide({
    name: "example1",

    // this is executed when the slide is shown
    start: function() {
      // hide error message
      $('.err').hide();
    },

    // this is executed when the participant clicks the "Continue button"
    button: function() {
      // read in the value of the selected radio button
      this.radio = $("input[name='number']:checked").val();
      // check whether the participant selected a reasonable value (i.e, 5, 6, or 7)
      if (this.radio == "5" || this.radio == "6" || this.radio == "7") {
        // log response
        this.log_responses();
        // continue to next slide
        exp.go();
      } else {
        // participant gave non-reasonable response --> show error message
        $('.err').show();
        this.log_responses();
      }
    },

    log_responses: function() {
      // add response to exp.data_trials
      // this data will be submitted at the end of the experiment
      exp.data_trials.push({
        "slide_number_in_experiment": exp.phase,
        "id": "example1",
        "response": this.radio,
        "strangeSentence": "",
        "sentence": "",
      });
    },
  });

  // set up slide for second example trial
  slides.example2 = slide({
    name: "example2",

    start: function() {
      // hide error message
      $(".err").hide();
    },

    // handle button click
    button: function() {
      this.radio = $("input[name='number']:checked").val();
      if (this.radio == "1" || this.radio == "2" || this.radio == "3") {
        this.log_responses();
        exp.go();
      } else {
        $('.err').show();
        this.log_responses();
      }
    },

    log_responses: function() {
      exp.data_trials.push({
        "slide_number_in_experiment": exp.phase,
        "id": "example2",
        "response": this.radio,
        "strangeSentence": "",
        "sentence": "",
      });
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

    start: function() {
      var stim = {
        "TGrep": "37224:9",
        "Context": "Speaker A:  and, and i, you know, i still provide most of the things that  go on around the house.<p>Speaker B: right.<p>Speaker A: so, uh, yeah and for a while i was going to school too, and tha-, it was tough.<p>Speaker B: yeah,  i uh, i think that while it 's a good change for i think women to be able  to fulfill their potential in whatever they feel, you know, their expertise may be .<p>Speaker A: uh-huh.<p>Speaker B: uh-huh.<p>Speaker A: uh, i think sometimes other things suffer and tha-, i think it 's hard to find a balance there.<p>Speaker B: ",
        "EntireSentence": "but in some ways i think we are expected  to do it all.",
        "ButNotAllSentence": "but in <strong>some, but not all</strong> ways i think we are expected  to do it all."
      }    
    // The 7 lines above from "start:..." to the end of var stim = {...}" define a placeholder stimulus that you will have to delete when
    // loading in the individual stimulus data. 

    // To rotate through stimulus list, comment out the above 7 lines and  uncomment the following 2:
    // present: exp.stimuli,
    // present_handle : function(stim) {

      // unselect all radio buttons at the beginning of each trial
      // (by default, the selection of the radio persists across trials)
      $("input[name='number']:checked").prop("checked", false);
      $("#check-strange").prop("checked", false);

      // store stimulus data
      this.stim = stim;

      // extract original and sentence with "but not all"
      var original_sentence = stim.EntireSentence;
      var target_sentence = stim.ButNotAllSentence;

      //handle display of context 
      // if (exp.condition == "context") {
      //   // extract context data
      //   var contexthtml = stim.Context;
      //   // reformat the speaker information for context
      //   contexthtml = contexthtml.replace(/Speaker A:/g, "<b>Speaker #1:</b>");
      //   contexthtml = contexthtml.replace(/Speaker B:/g, "<b>Speaker #2:</b>");
      //   $(".case").html(contexthtml);
      // } else {
      //   var contexthtml = "";
      //   $(".case").html(contexthtml);
      // }

      // replace the placeholder in the HTML document with the relevant sentences for this trial
      $("#trial-originalSen").html(original_sentence);
      $("#trial-targetSen").html(target_sentence);
      $(".err").hide();

    },

    // handle click on "Continue" button
    button: function() {
      this.radio = $("input[name='number']:checked").val();
      this.strange = $("#check-strange:checked").val() === undefined ? 0 : 1;
      if (this.radio) {
        this.log_responses();
        exp.go(); //use exp.go() if and only if there is no "present"ed data, ie no list of stimuli.
        // _stream.apply(this); //use _stream.apply(this) if there is a list of "present" stimuli to rotate through
      } else {
        $('.err').show();
      }
    },

    // save response
    log_responses: function() {
      exp.data_trials.push({
        "id": this.stim.TGrep,
        // "sentence": this.stim.ButNotAllSentence,
        // "slide_number_in_experiment": exp.phase, //exp.phase is a built-in trial number tracker
        "response": this.radio,
        "strangeSentence": this.strange
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
  var stimuli = all_stims;

  exp.stimuli = stimuli; //call _.shuffle(stimuli) to randomize the order;
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
    "example1",
    "example2",
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
