# Sebastian's merge script
# merges multiple results files and updates anonymized worker ID and sets speaker condition to speaker_cond
# Usage: merge_results.R file1 speaker_cond1 file2 speaker_cond2 ...
#you can call it as `Rscript merge_results.R file1.csv X file2.csv Y file3.csv X ...`the `X` and `Y` can be just any strings that are being written to the variable in each row `speaker_cond`

args = commandArgs(trailingOnly=TRUE)

n_args = length(args)

if (n_args > 1 || n_args %% 2 != 0) {
  
  d = read.csv(args[1])
  d$speaker_cond = args[2]
  
  n_files = n_args/2
  if (n_files > 1) {
    for (i in 2:n_files) {
      max_workerid = max(d$workerid)
      d2 = read.csv(args[i*2 - 1])
      d2$speaker_cond = args[i*2]
      d2$workerid = d2$workerid + max(d$workerid) + 1
      d = rbind(d, d2)
    }
  }
  
  write.csv(d, file="subject_info_merged.csv", row.names = FALSE)
  write.csv(d, file="", row.names = FALSE)
  
} else {
  print("Not enough arguments supplied!")
}