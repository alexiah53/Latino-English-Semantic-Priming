Latino English Semantic Priming
================

## Exclusions

### Native Language

Excluding English L2

    ## [1] 1

### Accuracy

Excluding participants with accuracy rates lower than 90%
![](analysis_files/figure-gfm/unnamed-chunk-3-1.png)<!-- -->

### Duration

Excluding participants who take more than 2.5 SDs from mean completion
time

Average Time Taken to Complete Experiment:

    ## [1] 23.94633

![](analysis_files/figure-gfm/unnamed-chunk-5-1.png)<!-- -->

### Individual Responses

Excluding individual responses that are faster than 500ms or more than 3
SDs from mean RT

    ## [1] 420

Excluding Incorrect Individual Responses

    ## [1] 2128

## Plots

### Raw RT Histogram

![](analysis_files/figure-gfm/unnamed-chunk-8-1.png)<!-- -->

### Log Transformed RT Histogram

![](analysis_files/figure-gfm/unnamed-chunk-9-1.png)<!-- -->

### All Conditions RT Bar Plot

![](analysis_files/figure-gfm/unnamed-chunk-10-1.png)<!-- -->

### Split Condition RT Bar Plot

![](analysis_files/figure-gfm/unnamed-chunk-11-1.png)<!-- -->

### Response Times by Trial Number

![](analysis_files/figure-gfm/unnamed-chunk-12-1.png)<!-- -->

### Response Times for Individual Targets - Semantically Related vs. Semantically Unrelated

![](analysis_files/figure-gfm/unnamed-chunk-13-1.png)<!-- -->

### RT Bar Plot by Exposure to Hispanic/Latinx Population

![](analysis_files/figure-gfm/unnamed-chunk-14-1.png)<!-- -->

## Additional Responses

### Analyzing Reactions to Voices

Miami Cuban American English Speaker 1
![](analysis_files/figure-gfm/unnamed-chunk-15-1.png)<!-- -->

Miami Cuban American English Speaker 2
![](analysis_files/figure-gfm/unnamed-chunk-16-1.png)<!-- -->

## Models

### Linear Mixed Model for Northeastern White American Talker Condition

### Linear Mixed Model for Miami Cuban American Talker Condition

    ## Linear mixed model fit by REML. t-tests use Satterthwaite's method [
    ## lmerModLmerTest]
    ## Formula: RT ~ centered_trial_type + (1 + centered_trial_type | workerid) +  
    ##     (1 + centered_trial_type | Target)
    ##    Data: CE_data
    ## 
    ## REML criterion at convergence: -2887.6
    ## 
    ## Scaled residuals: 
    ##     Min      1Q  Median      3Q     Max 
    ## -4.2475 -0.6005 -0.1450  0.4289  4.9428 
    ## 
    ## Random effects:
    ##  Groups   Name                Variance Std.Dev. Corr
    ##  Target   (Intercept)         0.004956 0.07040      
    ##           centered_trial_type 0.002759 0.05252  0.07
    ##  workerid (Intercept)         0.011702 0.10818      
    ##           centered_trial_type 0.001106 0.03325  0.54
    ##  Residual                     0.028068 0.16754      
    ## Number of obs: 4617, groups:  Target, 80; workerid, 60
    ## 
    ## Fixed effects:
    ##                      Estimate Std. Error        df t value Pr(>|t|)    
    ## (Intercept)          6.869912   0.016225 92.972707 423.428  < 2e-16 ***
    ## centered_trial_type -0.069373   0.008828 78.048168  -7.859 1.76e-11 ***
    ## ---
    ## Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1
    ## 
    ## Correlation of Fixed Effects:
    ##             (Intr)
    ## cntrd_trl_t 0.249

### Linear Mixed Model for LA Mexican American Talker Condition

### Linear Mixed Model for All Talker Conditions
