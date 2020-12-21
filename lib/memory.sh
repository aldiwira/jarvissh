S="************************************"
D="-------------------------------------"
COLOR="y"

echo -e "$S"
echo -e "\tMemory Status"
echo -e "$S"

echo -e "\nTop 5 Memory Resource Hog Processes"
echo -e "$D$D"
ps -eo pmem,pid,ppid,user,stat,args --sort=-pmem|grep -v $$|head -6|sed 's/$/\n/'