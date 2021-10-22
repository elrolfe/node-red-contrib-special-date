const { test, expect } = require("@jest/globals");
const checkDate = require("./checkDate");

const JULY_4 = new Date(2021, 6, 4); // Months are 0-indexed

const DEFAULT_RESPONSE = {
  type: "default",
  response: "no",
};

test("Default response on no matching dates", () => {
  const dateList = [ DEFAULT_RESPONSE ];

  expect(checkDate(JULY_4, dateList)).toBe("no");
});

test("Matches a specific date", () => {
  // July 4
  const dateList = [
    {
      type: "date",
      startMonth: JULY_4.getMonth(),
      startDate: JULY_4.getDate(),
      response: "yes",
    },
    DEFAULT_RESPONSE,
  ];

  let testDate = new Date(JULY_4);
  expect(checkDate(testDate, dateList)).toBe("yes");

  testDate.setDate(3);
  expect(checkDate(testDate, dateList)).toBe("no");
  testDate.setDate(5);
  expect(checkDate(testDate, dateList)).toBe("no");
});

test("Matches a date range", () => {
  const july = JULY_4.getMonth();

  // In the same month - July 3 to July 5
  let dateList = [
    {
      type: "range",
      startMonth: july,
      startDate: 3,
      endMonth: july,
      endDate: 5,
      response: "yes",
    },
    DEFAULT_RESPONSE,
  ];

  let testDate = new Date(JULY_4);
  for (let i = 2; i <= 6; i++) {
    testDate.setDate(i);
    expect(checkDate(testDate, dateList)).toBe(i >= 3 && i <= 5 ? "yes" : "no");
  }

  // Spanning two months - June 30 to July 1
  dateList = [
    {
      type: "range",
      startMonth: july - 1,
      startDate: 30,
      endMonth: july,
      endDate: 1,
      response: "yes",
    },
    DEFAULT_RESPONSE,
  ];

  testDate = new Date(2021, july - 1, 29);
  expect(checkDate(testDate, dateList)).toBe("no");
  testDate.setDate(30);
  expect(checkDate(testDate, dateList)).toBe("yes");
  testDate.setMonth(july);
  testDate.setDate(1);
  expect(checkDate(testDate, dateList)).toBe("yes");
  testDate.setDate(2);
  expect(checkDate(testDate, dateList)).toBe("no");

  // Spanning three months - June 1 to August 31
  dateList = [
    {
      type: "range",
      startMonth: july - 1,
      startDate: 1,
      endMonth: july + 1,
      endDate: 31,
      response: "yes",
    },
    DEFAULT_RESPONSE,
  ];

  testDate = new Date(2021, july - 2, 31);
  expect(checkDate(testDate, dateList)).toBe("no");
  testDate.setMonth(july - 1);
  for (let i = 1; i <= 30; i++) {
    testDate.setDate(i);
    expect(checkDate(testDate, dateList)).toBe("yes");
  }
  testDate.setMonth(july);
  for (let i = 1; i <= 31; i++) {
    testDate.setDate(i);
    expect(checkDate(testDate, dateList)).toBe("yes");
  }
  testDate.setMonth(july + 1);
  for (let i = 1; i <= 31; i++) {
    testDate.setDate(i);
    expect(checkDate(testDate, dateList)).toBe("yes");
  }
  testDate.setMonth(july + 2);
  testDate.setDate(1);
  expect(checkDate(testDate, dateList)).toBe("no");

  // Two months spanning years - December 28 to January 2
  dateList = [
    {
      type: "range",
      startMonth: 11,
      startDate: 28,
      endMonth: 0,
      endDate: 2,
      response: "yes",
    },
    DEFAULT_RESPONSE,
  ];

  testDate.setMonth(11)
  testDate.setDate(27);
  expect(checkDate(testDate, dateList)).toBe("no");
  for (let i = 0; i < 6; i++) {
    testDate.setDate(testDate.getDate() + 1);
    expect(checkDate(testDate, dateList)).toBe("yes");
  }
  testDate.setDate(testDate.getDate() + 1);
  expect(checkDate(testDate, dateList)).toBe("no");

  // Four months spanning years - November 1 to February 28
  dateList = [
    {
      type: "range",
      startMonth: 10,
      startDate: 1,
      endMonth: 1,
      endDate: 28,
      response: "yes",
    },
    DEFAULT_RESPONSE,
  ];

  testDate.setMonth(10);
  testDate.setDate(0);
  expect(checkDate(testDate, dateList)).toBe("no");
  for (let i = 0; i < 120; i++) {
    testDate.setDate(testDate.getDate() + 1);
    expect(checkDate(testDate, dateList)).toBe("yes");
  }
  testDate.setDate(testDate.getDate() + 1);
  expect(checkDate(testDate, dateList)).toBe("no");

  // Extreme example - June 8 to June 6
  dateList = [
    {
      type: "range",
      startMonth: 5,
      startDate: 8,
      endMonth: 5,
      endDate: 6,
      response: "yes",
    },
    DEFAULT_RESPONSE,
  ];

  testDate.setMonth(5);
  testDate.setDate(5);
  expect(checkDate(testDate, dateList)).toBe("yes");
  testDate.setDate(6);
  expect(checkDate(testDate, dateList)).toBe("yes");
  testDate.setDate(7);
  expect(checkDate(testDate, dateList)).toBe("no");
  testDate.setDate(8);
  expect(checkDate(testDate, dateList)).toBe("yes");
  testDate.setDate(9);
  expect(checkDate(testDate, dateList)).toBe("yes");
});

test("Matches ordinal date descriptions", () => {
  // Ordinal for third June 15 day of this year
  const dateList = [
    {
      type: "ordinal",
      startOrdinal: 2,
      startDay: new Date(new Date().getFullYear(), 5, 15).getDay(),
      startMonthOrdinal: 5,
      response: "yes",
    },
    DEFAULT_RESPONSE,
  ];

  let June15 = new Date(new Date().getFullYear(), 5, 15);
  let testDate = new Date(June15);
  expect(checkDate(testDate, dateList)).toBe("yes");
  testDate.setDate(14);
  expect(checkDate(testDate, dateList)).toBe("no");
  testDate.setDate(16);
  expect(checkDate(testDate, dateList)).toBe("no");
  testDate.setDate(8); // Second ordinal week
  expect(checkDate(testDate, dateList)).toBe("no");
  testDate.setDate(22); // Fourth ordinal week
  expect(checkDate(testDate, dateList)).toBe("no");

  dateList[0].startOrdinal = -1; // Any June 15 day in the month of June
  testDate = new Date(June15);
  expect(checkDate(testDate, dateList)).toBe("yes");
  testDate.setDate(14);
  expect(checkDate(testDate, dateList)).toBe("no");
  testDate.setDate(16);
  expect(checkDate(testDate, dateList)).toBe("no");
  testDate.setDate(8); // Third ordinal week
  expect(checkDate(testDate, dateList)).toBe("yes");
  testDate.setDate(22); // Fifth ordinal week
  expect(checkDate(testDate, dateList)).toBe("yes");

  dateList[0].startOrdinal = 2; // Third June 15 day in any month
  dateList[0].startMonthOrdinal = -1;
  testDate = new Date(June15);
  expect(checkDate(testDate, dateList)).toBe("yes");
  testDate.setDate(14);
  expect(checkDate(testDate, dateList)).toBe("no");
  testDate.setDate(16);
  expect(checkDate(testDate, dateList)).toBe("no");
  testDate.setDate(8); // Third ordinal week
  expect(checkDate(testDate, dateList)).toBe("no");
  testDate.setDate(22); // Fifth ordinal week
  expect(checkDate(testDate, dateList)).toBe("no");

  testDate.setMonth(6);
  testDate.setDate(20); // July 20 = same day as June 15
  expect(checkDate(testDate, dateList)).toBe("yes");
  testDate.setDate(19);
  expect(checkDate(testDate, dateList)).toBe("no");
  testDate.setDate(21);
  expect(checkDate(testDate, dateList)).toBe("no");
  testDate.setDate(13);
  expect(checkDate(testDate, dateList)).toBe("no");
  testDate.setDate(27);
  expect(checkDate(testDate, dateList)).toBe("no");

  dateList[0].startOrdinal = -1; // Any June 15 day in any month
  dateList[0].startMonthOrdinal = -1;
  testDate = new Date(June15);
  expect(checkDate(testDate, dateList)).toBe("yes");
  testDate.setDate(14);
  expect(checkDate(testDate, dateList)).toBe("no");
  testDate.setDate(16);
  expect(checkDate(testDate, dateList)).toBe("no");
  testDate.setDate(8); // Third ordinal week
  expect(checkDate(testDate, dateList)).toBe("yes");
  testDate.setDate(22); // Fifth ordinal week
  expect(checkDate(testDate, dateList)).toBe("yes");

  testDate.setMonth(6);
  testDate.setDate(20); // July 20 = same day as June 15
  expect(checkDate(testDate, dateList)).toBe("yes");
  testDate.setDate(19);
  expect(checkDate(testDate, dateList)).toBe("no");
  testDate.setDate(21);
  expect(checkDate(testDate, dateList)).toBe("no");
  testDate.setDate(13);
  expect(checkDate(testDate, dateList)).toBe("yes");
  testDate.setDate(27);
  expect(checkDate(testDate, dateList)).toBe("yes");
});

test("Matches ordinal date offset range", () => {
  // Day before to the day after Thanksgiving
  let dateList = [
    {
      type: "ordinal-offset",
      startMonthOrdinal: 10,
      startOrdinal: 3,
      startDay: 4,
      offsetOrdinalBefore: 1,
      offsetOrdinalAfter: 1,
      response: "yes",
    },
    DEFAULT_RESPONSE,
  ];

  let testDate = new Date();
  testDate.setMonth(10);
  testDate.setDate(22);
  while (testDate.getDay() !== 4)
    testDate.setDate(testDate.getDate() + 1);

  testDate.setDate(testDate.getDate() - 2);
  expect(checkDate(testDate, dateList)).toBe("no");
  for (let i = 0; i < 3; i++) {
    testDate.setDate(testDate.getDate() + 1);
    expect(checkDate(testDate, dateList)).toBe("yes");
  }
  testDate.setDate(testDate.getDate() + 1);
  expect(checkDate(testDate, dateList)).toBe("no");
})