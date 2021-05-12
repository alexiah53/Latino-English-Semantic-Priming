
myCenter <- function(x) {
  if (is.numeric(x)) { return(x - mean(x)) }
  if (is.character(x)) {
    x <- as.numeric(as.factor(x))
    return(x - mean(x))
  }
  if (is.factor(x)) {
    x <- as.numeric(x)
    return(x - mean(x))
  }
  if (is.data.frame(x) || is.matrix(x) || is.tibble(x)) {
    x = as.data.frame(x)
    m <- matrix(nrow=nrow(x), ncol=ncol(x))
    colnames(m) <- paste("c", colnames(x), sep="")
    for (i in 1:ncol(x)) {
      if (is.factor(x[,i])) {
        y <- as.numeric(x[,i])
        m[,i] <- y - mean(y, na.rm=T)
      }
      if (is.numeric(x[,i])) {
        m[,i] <- x[,i] - mean(x[,i], na.rm=T)
      }
      if (is.character(x[,i])) {
        m[,i] <- as.numeric(as.factor(x[,i])) - mean(as.numeric(as.factor(x[,i])), na.rm=T)
      }
    }
    return(as.data.frame(m))
  }
}

## for bootstrapping 95% confidence intervals
library(bootstrap)
theta <- function(x,xdata,na.rm=T) {mean(xdata[x],na.rm=na.rm)}
ci.low <- function(x,na.rm=T) {
  mean(x,na.rm=na.rm) - quantile(bootstrap(1:length(x),1000,theta,x,na.rm=na.rm)$thetastar,.025,na.rm=na.rm)}
ci.high <- function(x,na.rm=T) {
  quantile(bootstrap(1:length(x),1000,theta,x,na.rm=na.rm)$thetastar,.975,na.rm=na.rm) - mean(x,na.rm=na.rm)}

## for creating the summary table in Appendix D
createLatexTableLinear = function(m, predictornames=c())
{
  coefs = m
  
  coefs[,1] = round(coefs[,1],digits=2)
  coefs[,2] = round(coefs[,2],digits=2)
  coefs[,4] = round(coefs[,4],digits=1)
  coefs$P = ifelse(coefs[,5] > .05, paste(">",round(coefs[,5],digits=2),sep=""), ifelse(coefs[,5] < .0001, "\\textbf{<.0001}", ifelse(coefs[,5] < .001,"\\textbf{<.001}", ifelse(coefs[,5] < .01, "\\textbf{<.01}", "\\textbf{<.05}"))))
  head(coefs)
  coefs[,3] = NULL
  coefs[,4] = NULL  
  colnames(coefs) = c("Coef $\\beta$","SE($\\beta$)", "\\textbf{t}","$p$")
  coefs
  
  if (length(predictornames > 0))
  {
    prednames = data.frame(PName=row.names(coefs),NewNames=predictornames)
  } else {
    prednames = data.frame(PName=row.names(coefs),NewNames=row.names(coefs))		
  }
  
  row.names(coefs) = prednames$NewNames[prednames$PName == row.names(coefs)]
  
  latex(coefs,file="",title="",table.env=TRUE,booktabs=TRUE)
}

