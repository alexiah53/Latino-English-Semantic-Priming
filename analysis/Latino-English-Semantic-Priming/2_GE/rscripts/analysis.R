library(tidyverse)
library(lme4)
library(lmerTest)

setwd(dirname(rstudioapi::getActiveDocumentContext()$path))
source("helpers.R")

# color-blind-friendly palette
cbPalette <- c("#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7") 

# load the main data
d = read_csv("../../../data/01_implicature_strength/exp-merged.csv")
View(d)

# load information about contextual features and merge into dataset
context = read_csv("../../../data/01_implicature_strength/context.csv")
d = d %>%
  left_join(context,by=c("id"))

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

