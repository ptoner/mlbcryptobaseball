cd src

perBatch=5000

startNum=0
endNum=160000

while [ "$startNum" -lt "$endNum" ]
do
    endBatch=$((startNum + perBatch))

    ts-node index.ts -start $startNum -end $endBatch & 
    
    startNum=$((startNum + perBatch))


done

wait 