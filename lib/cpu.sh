S="************************************"
D="-------------------------------------"
COLOR="y"

echo -e "$S"
echo -e "\tCPU Status"
echo -e "$S"

echo -e "\nTop 5 CPU Resource Hog Processes"
echo -e "$D$D"
ps -eo pcpu,pid,ppid,user,stat,args --sort=-pcpu|grep -v $$|head -6|sed 's/$/\n/'