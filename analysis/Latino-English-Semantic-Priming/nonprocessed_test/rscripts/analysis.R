library(tidyverse)
library(lme4)
library(lmerTest)

setwd(dirname(rstudioapi::getActiveDocumentContext()$path))
source("helpers.R")

#removes gray boxes from plots
theme_set(theme_bw())

# color-blind-friendly palette
cbPalette <- c("#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7") 

# load the main data
d = read_csv("../data/nonprocessed_test-trials.csv") 
#View(d)

d = d %>%
  mutate(id = row_number())

# load information about contextual features and merge into dataset
subject_info = read_csv("../data/nonprocessed_test-subject_information.csv")
#View(subject_info)

#excluding English L2 speakers from workerids to analyze
lang_exclude = subject_info %>% 
  select(workerid, first_language) %>% 
  filter(str_detect(first_language,regex("english", ignore_case=TRUE),negate=TRUE)) %>%
  select(workerid) 

#this excludes worker ids for English L2 speakers from df
d = d[!(d$workerid %in% lang_exclude$workerid),]

#excludes participants who don't complete study
trial_number = d %>%
  group_by(workerid) %>%
  count()
View(trial_number)
View(subject_info)

#exclude NAs from data analysis (follow up Qs, etc.)
d_trials = d %>%
  filter(!is.na(Trial_Type))

#View(d_trials)

# exclude individual responses with RTs that are 3 SDs away from  mean
exclude_sd = d_trials %>%
  mutate(Mean=mean(Response_Time),SD=sd(Response_Time),count=n()) %>%
  mutate(Ulimit=Mean+3*SD,Llimit=Mean-3*SD) %>%
  mutate(slow=ifelse(Response_Time>Ulimit,"1","0")) %>%
  mutate(fast=ifelse(Response_Time<Llimit,"1","0")) %>%
  select(workerid,id,Response_Time,slow,fast,Mean,SD,Llimit,Ulimit) %>%
  filter(slow==1 | fast == 1)

View(exclude_sd)

d = d[!(d$id %in% exclude_sd$id),]
View(d)

ggplot(d, aes(x=Response_Time)) +
  geom_histogram(fill="lightblue")




#include only critical trials
d_criticals = d %>%
  filter(Trial_Type == "critical")
View(d_criticals)


#if response == target word type, assign 1 as correct
d_criticals = d_criticals %>%
  mutate(correct=ifelse(Response==Target_Word_Type,1,0))

  
#Participants with accuracy lower than 90% are excluded 
accuracy_d =  d_criticals %>%
  group_by(workerid) %>%
  summarise(Mean=mean(correct),CILow=ci.low(correct),CIHigh=ci.high(correct)) %>%
  ungroup() %>%
  mutate(YMin=Mean-CILow,YMax=Mean+CIHigh) %>%
  # this assigns 1 to people with low accuracy rates. 1s will be excluded
  mutate(lowacc=ifelse(Mean<0.90,"1","0"))

View(accuracy_d)

#value of horizontal line
h=0.90
ggplot(accuracy_d, aes(x=reorder(workerid,Mean), y=Mean, fill=lowacc)) +
  geom_bar(stat="identity") +
  geom_hline(yintercept=h) +
  geom_text(aes(0, h, label=h, vjust=-1, hjust=-0.3)) +
  scale_fill_manual(values = cbPalette)

#this excludes participants who have 10% error rate or more from full set
exclude = accuracy_d %>%
  filter(lowacc==1)
exclude
d = d[!(d$workerid %in% exclude$workerid),]

  



# exclude individual responses with RTs that are 3 SDs away from  mean
exclude_sd = d_trials %>%
  mutate(Mean=mean(Response_Time),SD=sd(Response_Time),count=n()) %>%
  mutate(Ulimit=Mean+3*SD,Llimit=Mean-3*SD) %>%
  mutate(slow=ifelse(Response_Time>Ulimit,"1","0")) %>%
  mutate(fast=ifelse(Response_Time<Llimit,"1","0")) %>%
  # excludes individual responses <500ms
  mutate(toofast=ifelse(Response_Time<500, "1", "0")) %>%
  select(workerid,id,Response_Time,slow,fast,toofast,Mean,SD,Llimit,Ulimit) %>%
  filter(slow==1 | fast == 1 | toofast == 1)

View(exclude_sd)

d = d[!(d$id %in% exclude_sd$id),]
View(d)


#Participants who take more than 2.5 sds than mean completion time are excluded

exp_time_d = d %>%
  mutate(Mean=mean(Answer.time_in_minutes),SD=sd(Answer.time_in_minutes)) %>%
  mutate(Ulimit=Mean+2.5*SD,Llimit=Mean-2.5*SD) %>%
  mutate(slow=ifelse(Answer.time_in_minutes>Ulimit,"1","0")) %>%
  mutate(fast=ifelse(Answer.time_in_minutes<Llimit,"1","0")) %>%
  select(workerid,id,Answer.time_in_minutes,slow,fast,Mean,SD,Llimit,Ulimit) %>%
  filter(slow==1 | fast == 1)

#View(exp_time_d)

d = d[!(d$workerid %in% exp_time_d$workerid),]










# limit dataset to only target trials
d = d %>% 
  filter(!id %in% c("example1","example2")) %>% 
  droplevels()

# there's all kinds of demographic info we might want to plot, but let's head straight for the meaty bit

# generate histogram of mean by-item ratings
agr = d %>% 
  group_by(id) %>% 
  summarise(mean = mean(response), prop_odd = mean(strangeSentence))

ggplot(agr, aes(x=mean)) +
  geom_histogram() +
  xlab("Mean by-item inference strength rating") +
  ylab("Number of cases")

# generate histogram of proportion of "odd sentence" judgments
ggplot(agr, aes(x=prop_odd)) +
  geom_histogram() +
  xlab("By-item proportion of 'odd' judgments") +
  ylab("Number of cases")
ggsave(file="../graphs/histogram_means.pdf",width=4,height=3.2)
  
# is there a correlation between oddness judgments and inference strength ratings?
ggplot(agr, aes(x=prop_odd,y=mean)) +
  geom_point() +
  xlab("By-item proportion of 'odd' judgments") +
  ylab("Mean by-item rating") 

# are inference strength ratings modulated by partitive?
agr = d %>%
  group_by(partitive) %>%
  summarise(Mean = mean(response),CILow=ci.low(response),CIHigh=ci.high(response)) %>%
  ungroup() %>%
  mutate(YMin=Mean-CILow,YMax=Mean+CIHigh) %>%
  mutate(partitive = fct_recode(partitive,"partitive"="yes","non-partitive"="no"))

ggplot(agr,aes(x=partitive,y=Mean)) +
  geom_bar(stat="identity",color="black",width=.6,fill="gray60") +
  geom_errorbar(aes(ymin=YMin,ymax=YMax),width=.25,color="black") +
  scale_fill_manual(values=c("#56B4E9")) +
  ylab("Mean inference strength rating")
ggsave(file="../graphs/means_partitive.pdf",width=4,height=3.2)

# add by-participant means to the plot to display measure of variability
agr_subj = d %>%
  group_by(partitive,workerid) %>%
  summarise(Mean = mean(response),CILow=ci.low(response),CIHigh=ci.high(response)) %>%
  ungroup() %>%
  mutate(YMin=Mean-CILow,YMax=Mean+CIHigh) %>%
  mutate(partitive = fct_recode(partitive,"partitive"="yes","non-partitive"="no"))

ggplot(agr,aes(x=partitive,y=Mean)) +
  geom_bar(stat="identity",color="black",width=.6,fill="gray60") +
  geom_errorbar(aes(ymin=YMin,ymax=YMax),width=.25,color="black") +
  geom_point(data=agr_subj,alpha=.3) +
  scale_fill_manual(values=c("#56B4E9")) +
  ylab("Mean inference strength rating")
ggsave(file="../graphs/means_partitive.pdf",width=4,height=3.2)

# are inference strength ratings modulated by subjecthood?
d$subjecthood = as.factor(as.character(d$subjecthood))

agr = d %>%
  group_by(subjecthood) %>%
  summarise(Mean = mean(response),CILow=ci.low(response),CIHigh=ci.high(response)) %>%
  ungroup() %>%
  mutate(YMin=Mean-CILow,YMax=Mean+CIHigh) %>%
  mutate(subjecthood = fct_recode(subjecthood,"subject"="1","other"="0"))

agr_subj = d %>%
  group_by(subjecthood,workerid) %>%
  summarise(Mean = mean(response),CILow=ci.low(response),CIHigh=ci.high(response)) %>%
  ungroup() %>%
  mutate(YMin=Mean-CILow,YMax=Mean+CIHigh) %>%
  mutate(subjecthood = fct_recode(subjecthood,"subject"="1","other"="0"))

ggplot(agr,aes(x=subjecthood,y=Mean)) +
  geom_bar(stat="identity",color="black",width=.6,fill="gray60") +
  geom_errorbar(aes(ymin=YMin,ymax=YMax),width=.25,color="black") +
  geom_point(data=agr_subj,alpha=.3) +
  scale_fill_manual(values=c("#56B4E9")) +
  ylab("Mean inference strength rating")
ggsave(file="../graphs/means_subjecthood.pdf",width=4,height=3.2)

# are inference strength ratings modulated by discourse givenness?
d$subjecthood = as.factor(as.character(d$subjecthood))

agr = d %>%
  group_by(infoStatus) %>%
  summarise(Mean = mean(response),CILow=ci.low(response),CIHigh=ci.high(response)) %>%
  ungroup() %>%
  mutate(YMin=Mean-CILow,YMax=Mean+CIHigh) %>%
  mutate(infoStatus = fct_recode(infoStatus,"mediated"="med")) %>% 
  mutate(infoStatus = fct_relevel(infoStatus, "new", "mediated"))

agr_subj = d %>%
  group_by(infoStatus,workerid) %>%
  summarise(Mean = mean(response),CILow=ci.low(response),CIHigh=ci.high(response)) %>%
  ungroup() %>%
  mutate(YMin=Mean-CILow,YMax=Mean+CIHigh) %>%
  mutate(infoStatus = fct_recode(infoStatus,"mediated"="med")) %>% 
  mutate(infoStatus = fct_relevel(infoStatus, "new", "mediated"))

ggplot(agr,aes(x=infoStatus,y=Mean)) +
  geom_bar(stat="identity",color="black",width=.6,fill="gray60") +
  geom_errorbar(aes(ymin=YMin,ymax=YMax),width=.25,color="black") +
  geom_point(data=agr_subj,alpha=.3) +
  scale_fill_manual(values=c("#56B4E9")) +
  ylab("Mean inference strength rating")
ggsave(file="../graphs/means_infoStatus.pdf",width=4,height=3.2)

# are inference strength ratings modulated by strength of "some"?
agr = d %>%
  group_by(id,strengthSome) %>%
  summarise(Mean = mean(response),CILow=ci.low(response),CIHigh=ci.high(response)) %>%
  ungroup() 

ggplot(agr,aes(x=strengthSome,y=Mean)) +
  geom_point() +
  geom_smooth(method="lm") +
  ylab("Mean inference strength rating") +
  xlab("Strength of quantifier (lower is stronger)")
ggsave(file="../graphs/means_strengthSome.pdf",width=4,height=3.2)


# To run the regression reported in Degen 2015:

# first mean-center variables for interpretability
centered = cbind(d, myCenter(d[,c("strengthSome","logSentenceLength","subjecthood","partitive")]))

m = lmer(response ~ cpartitive*cstrengthSome+infoStatus*csubjecthood + clogSentenceLength + (1|workerid) + (1|id), data=centered)
summary(m)

