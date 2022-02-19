




    let mutatedData: Map<string, FlipEvent[]> | null = null

    if (userExists.Item) {
      const newMap: Map<string, FlipEvent[]> = new Map(Object.entries(userExists.Item.days))

      for (const [key, value] of Object.entries(groupedDays)) {
        if (!newMap.has(key)) {
          console.log('found new day key')
          const updateMap = {
            ExpressionAttributeNames: { "#DA": "days", "#ID": key },
            ExpressionAttributeValues: { ":dm": value },
            Key: { user: 'gty' },
            ReturnValues: "ALL_NEW",
            TableName: process.env.UserDays?? 'noTable',
            UpdateExpression: "SET #DA.#ID = :dm"
          }
          const updatedRes = await dynamoDb.update(updateMap).promise()
          const days: Record<string, FlipEvent[]> = updatedRes.Attributes?.days
          const updatedMap = new Map(Object.entries(days))
          mutatedData = sortDays(updatedMap)
        } else {
          mutatedData = sortDays(newMap)
        }
      }

      /* might be able to have unfinished days never update */
      const getLastDayArr = (map: Map<string, FlipEvent[]>) => {
        const lastDayArr = Array.from(map)[map.size-1][1]
        return lastDayArr.reduce((feMap, feObj) => {
          feMap[feObj.start] = feObj
          return feMap
        }, {})
      }

      const lastDayDynamo = getLastDayArr(mutatedData)
      const lastMapDynamo = new Map(Object.entries(lastDayDynamo))
      const lastDayIcal = getLastDayArr(new Map(Object.entries(groupedDays)))
      const lastMapIcal = new Map(Object.entries(lastDayIcal))

      const shitArray = Array.from(lastMapIcal)

      for (const [key, value] of Object.entries(lastDayIcal)) {
        if (!lastMapDynamo.has(key)) {
          console.log('found new flip event key')
          console.log(value, 'value', key)

          const updateMap = {
            ExpressionAttributeNames: { "#DA": "days", "#DI": shitArray[0][1].dayBegins },
            ExpressionAttributeValues: { ":fe": value },
            Key: { user: 'gty' },
            ReturnValues: "ALL_NEW",
            TableName: process.env.UserDays?? 'noTable',
            UpdateExpression: "SET #DA.#DI = list_append(#DA.#DI, :fe)"
          }
          const updatedRes = await dynamoDb.update(updateMap).promise()
          console.log(updatedRes, 'updatedDay res')
        }
      }

    } else {
      mutatedData = groupedDays
      await dynamoDb.put(newDbEntry).promise()
    }

    const returnData = mutatedData ? Object.fromEntries(mutatedData) : groupedDays







    function groupByDays(objectArray: FlipEvent[]) {
      return objectArray.reduce<Record<string, FlipEvent[]>>((acc, cur) => {
        const key = cur.dayBegins
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(cur)
        return acc
      }, {})
    }




    function addDuration(sorted: FlipEvent[]) {
      const newEvents = []
      for (let i = 0; i < sorted.length - 1; i++) {
        sorted[i].duration = sorted[i + 1].start - sorted[i].start
        const unmodifiedDuration = sorted[i + 1].start - sorted[i].start
        if ((sorted[i].duration + sorted[i].start) > (sorted[i].dayBegins + 86400000)) {
          sorted[i].duration = (sorted[i].dayBegins + 86400000) - sorted[i].start
          const nextDayDuration = unmodifiedDuration - sorted[i].duration
          const newFlip = {
            dayBegins: sorted[i].dayBegins + 86400000,
            start: sorted[i].dayBegins + 86400000,
            duration: nextDayDuration,
            summary: sorted[i].summary,
          }
          newEvents.push({ i: i, newFlip: newFlip })
        }
  
      }
      newEvents.forEach((newFlip) => {
        sorted.splice(newFlip.i, 0, newFlip.newFlip)
      })
      return sorted
    }