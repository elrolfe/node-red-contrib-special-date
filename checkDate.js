module.exports = function (date, dateList) {
  let startDate, endDate;

  for (let i = 0; i < dateList.length; i++) {
    switch (dateList[i].type) {
      case "date":
        if (date.getMonth() === dateList[i].startMonth && date.getDate() === dateList[i].startDate)
          return dateList[i].response;
        break;

      case "range":
        if (dateList[i].startMonth === dateList[i].endMonth) {
          if (dateList[i].startDate > dateList[i].endDate) {
            if (date.getMonth() === dateList[i].startMonth && (date.getDate() >= dateList[i].startDate || date.getDate() <= dateList[i].endDate))
              return dateList[i].response;
            else if (date.getMonth() !== dateList[i].startMonth)
              return dateList[i].response;
          } else {
            if (date.getMonth() === dateList[i].startMonth && date.getDate() >= dateList[i].startDate && date.getDate() <= dateList[i].endDate)
              return dateList[i].response;
          }
        } else if ((date.getMonth() === dateList[i].startMonth && date.getDate() >= dateList[i].startDate) || (date.getMonth() === dateList[i].endMonth && date.getDate() <= dateList[i].endDate))
          return dateList[i].response;
        else if (dateList[i].startMonth > dateList[i].endMonth) {
          if ((date.getMonth() > dateList[i].startMonth && date.getMonth() <= 11) || (date.getMonth() >= 0 && date.getMonth() < dateList[i].endMonth))
            return dateList[i].response;
        } else if (date.getMonth() > dateList[i].startMonth && date.getMonth() < dateList[i].endMonth)
          return dateList[i].response;

        break;

      case "ordinal":
        if (dateList[i].startOrdinal === -1 && dateList[i].startMonthOrdinal === -1) {
          // Any specific weekday in any month
          if (date.getDay() === dateList[i].startDay)
            return dateList[i].response;
        } else if (dateList[i].startOrdinal === -1) {
          // Any specific weekday in the month
          if (date.getDay() === dateList[i].startDay && date.getMonth() === dateList[i].startMonthOrdinal)
            return dateList[i].response;
        } else if (dateList[i].startMonthOrdinal === -1) {
          // Ordinal specific weekday in any month
          if (date.getDay() === dateList[i].startDay && parseInt((date.getDate() - 1) / 7) === dateList[i].startOrdinal)
            return dateList[i].response;
        } else {
          // Ordinal specific weekday in the month
          if (date.getMonth() === dateList[i].startMonthOrdinal && date.getDay() === dateList[i].startDay && parseInt((date.getDate() - 1) / 7) === dateList[i].startOrdinal)
            return dateList[i].response;
        }

        break;

      case "ordinal-offset":
        startDate = new Date();
        startDate.setMonth(dateList[i].startMonthOrdinal);
        startDate.setDate(7 * dateList[i].startOrdinal + 1);
        while (startDate.getDay() !== dateList[i].startDay) {
          startDate.setDate(startDate.getDate() + 1);
        }

        endDate = new Date(startDate);
        startDate.setDate(startDate.getDate() - dateList[i].offsetOrdinalBefore);
        endDate.setDate(endDate.getDate() + dateList[i].offsetOrdinalAfter);

        if (startDate.getMonth() === endDate.getMonth()) {
          if (startDate.getDate() > endDate.getDate()) {
            if (date.getMonth() === startDate.getMonth() && (date.getDate() >= startDate.getDate() || date.getDate() <= endDate.getDate()))
              return dateList[i].response;
            else if (date.getMonth() !== startDate.getMonth())
              return dateList[i].response;
          } else {
            if (date.getMonth() === startDate.getMonth() && date.getDate() >= startDate.getDate() && date.getDate() <= endDate.getDate())
              return dateList[i].response;
          }
        } else if ((date.getMonth() === startDate.getMonth() && date.getDate() >= startDate.getDate()) || (date.getMonth() === endDate.getMonth() && date.getDate() <= endDate.getDate()))
          return dateList[i].response;
        else if (startDate.getMonth() > endDate.getMonth()) {
          if ((date.getMonth() > startDate.getMonth() && date.getMonth() <= 11 || (date.getMonth() >= 0 && date.getMonth() < endDate.getMonth())))
            return dateList[i].response;
        } else if (date.getMonth() > startDate.getMonth() && date.getMonth() < endDate.getMonth())
          return dateList[i].response;
      
        break;

      case "default":
        return dateList[i].response;

      default:
        throw new Error("Unknown date type!");
    }
  }

  throw new Error("No default case found!");
};