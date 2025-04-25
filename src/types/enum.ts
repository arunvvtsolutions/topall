// API
const enum Apipoint {
  signin = '/api/auth/signin',

  //====================ADMIN APIS=======================
  //common
  uploadImage = 'upload',

  //academic
  getSubjects = 'subjects',
  updateSubjectOrder = 'subjects/order',
  updatStandardOrder = 'standard/sequenceOrder',
  standards = 'standard',
  updateTesttype = 'testType/sequenceOrder',
  lederboardTesttype = 'testType/updateLeaderBoard',
  updateTesttypeInstruction = 'testType/updateInstructions',
  getTesttype = 'testType',
  Testtype = 'testType',
  updateStreamOrder = 'streams/order',
  getStreams = 'streams',
  getYearList = 'academicYear/academicYearList',
  getYearListById = 'academicYear/academicYearById',
  creatYearList = 'academicYear/addAcademicYear',
  updateYearList = 'academicYear/academicYearByStandard',
  getTestTypeDropdown = 'testType/testType/List',

  standard = 'standard',
  getQBSubjects = 'syllabusLinking/qAndBankSubject',
  getSyllabusChapters = 'syllabusLinking/syllabusLink/topicList',
  updateSyllabusChapters = 'syllabusLinking/updateLinkSyllabus',
  syllabus = 'syllabusLinking',
  syllabusOrder = 'syllabusLinking/sequenceOrder',
  filterSyllabus = 'syllabusLinking/filter',
  viewSingleSyllabus = 'singleSyllabusList',
  updateSingleSyllabusSequenceOrder = 'updateSingleSyllabusSequenceOrder',

  // Test
  getPackages = 'test/packages',
  updateTest = 'test/update',
  createTest = 'test/create',
  fetchSingleTest = 'test/getById',
  //exams
  getExams = 'examination',
  filteredExam = 'examination/FilterTest',
  pinAndUnpinExams = 'examination/pinAndUnpin',
  deleteExam = 'examination/delete',
  getSyllabus = 'examination/syllabus',
  publishStatus = 'examination/changePublishStatus',
  getSections = 'sections/allSections',
  getSingleSections = 'sections/singleSection',
  importQuestionList = 'addQuestions/questions',

  TetstList = 'import-questions/getTestList',
  importList = 'import-questions/getQuestionList',
  getChapterList = 'addQuestions/chapterList',
  getTopicList = 'addQuestions/topicList',
  getQuestionModel = 'addQuestions/quesTypeList',
  searchQuestion = 'addQuestions/questions/search',
  addQuestions = 'addQuestions/questions',
  getSingleSection = 'sections/singleSection',
  getTestById = 'test/getById',

  getViewQuestions = 'viewQuestions',
  updateQuestionsOrder = 'viewQuestions/order',
  deleteQuestions = 'viewQuestions/delete',
  getReportTypes = 'viewQuestions/reportTypes',
  getUsageHistory = 'addQuestions/usageHistory',
  reportIssue = 'viewQuestions/reportIssue',

  //exams-sections
  sectionsList = 'sections/allSections',
  updateSectionSequence = 'sections/updateSequences',
  sectionsUpdate = 'sections/update',
  sectionsDelete = 'sections/delete',
  sectionsCreate = 'sections/create',
  singleSection = 'sections/singleSection',
  allFaculty = 'sections/allFaculty',

  //Student
  allIndiaMockTestList = 'allIndiaMockTest',
  allTestDates = 'allIndiaMockTest/scheduledDates',
  previousYear = 'previousYearTest',
  updateOnboard = 'profileDetails/update/profileDetails',
  states = 'profileDetails/states',
  verifyReferral = 'profileDetails/verifyReferralCode',
  getStudentReferralInfo = 'profileDetails/referAndEarn/studentData',
  getReferredStudents = 'profileDetails/referAndEarn/referredStudents',
  getTestTypeByStreamId = 'testType/getTestTypeByStreamId',

  // auth
  getOtp = 'auth/login',
  verifyOtp = 'auth/verifyLogin',
  refreshToken = 'auth/refreshToken',
  user = 'auth/user',

  //concept
  getConcepts = 'conceptWiseTest/createTestPreData',
  createConcepts = 'conceptWiseTest/create',
  getProfileDetails = 'auth/userDetail',
  getSingleConceptWiseTest = 'conceptWiseTest/getLastTestIdByStudent',
  startConceptWiseTest = 'conceptWiseTest/create',

  // Chapter Wise Tests
  chapterWiseTests = 'chapterWiseTest/getChapterTest',
  getLevelList = 'chapterWiseTest/getLevelList',
  practiceChapterWiseTest = 'chapterWiseTest/PracticeTest',
  getSingleChapterWiseTest = 'chapterWiseTest/getSingleTest',

  // generate test
  getPreData = 'generateTest/createTestPreData',
  generateTest = 'generateTest/create',
  genereatedTests = 'generateTest/list',
  viewSyllabus = 'generateTest/syllabus',
  getGenerateTestById = 'generateTest/singleTest',

  //profile
  getProfileState = 'profileDetails/states',
  getProfileCity = 'profileDetails/cities',
  updateProfileDetails = 'profileDetails/update/profileDetails',

  // bookmark
  addBookmark = 'bookmarks/add',
  getBookmarkTypes = 'bookmarks/types',
  getBookmarks = 'bookmarks/list',
  deleteBookmark = 'bookmarks/remove',

  //faculty
  getFacultyById = 'faculty',
  getFacultyList = 'faculty/faculty-list',
  createFaculty = 'faculty/create',
  updateFacultyActiveStatus = 'faculty/updateActiveStatus',
  updateFaculty = 'faculty/update',
  deleteFaculty = 'faculty/delete',

  //referral
  getReferralUsedCounts='referralBenefits/referralUsedCounts',
  getReferralBenefitsList='referralBenefits/referralBenefitsList',
  getReferralBenefitsHistory='referralBenefits/referralBenefitsHistory',
  getReferralLevels='referralBenefits/referralLevels',
  getReferralBenefits='referralBenefits',
  createReferral='referralBenefits/create',
  updateReferral='referralBenefits/update',
  deleteReferral='referralBenefits/delete',
  // Carousels
  carouselList = 'carousel/carousel-list',
  getSingleCarousel = 'carousel',
  createCarousel = 'carousel/create',
  updateCarousel = 'carousel/update',
  deleteCarousel = 'carousel/delete',
  updateCarouselOrder = 'carousel/order',

  // online examination
  oeStartTest = 'oe/startTest',
  oeResumeTest = 'oe/resumeTest',
  oeRetakeTest = 'oe/retakeTest',
  oeUpdateTest = 'oe/updateTest',
  oeUpdateTestEachSecond = 'oe/updateTestEachSecond',
  oeSubmitTest = 'oe/submitTest',
  oeMarkCalculation = 'oe/markCalculate',
  oeGetTestStatus = 'oe/getTestStatus',

  //exam-results
  getOverallResult = 'result/getOverallResult',
  getTimeAnalysis = 'result/timeAnalysis',
  getDifficultyStats = 'result/difficultyStats',
  getAnswerKey = 'result/answerKey',
  getSubjectwiseResult = 'result/getOverallSubjectResult',
  getChapterwiseResult = 'result/getChapterwiseResult',
  conceptWiseAnalysis = 'result/conceptWiseAnalysis',
  getLeaderboard = 'leaderboard/rankList',

  // Student Dashboard
  upcomingTests = 'dashboard/upcomingTests',
  questionwiseRank = 'dashboard/questionwiseRank',
  timewiseRank = 'dashboard/timewiseRank',
  referalwiseRank = 'dashboard/referralwiseRank',
  regionalRank = 'dashboard/regionalrankingRank',
  // overall analysis
  overallSubjectWiseAnalysis = 'overallAnalysis/overallSubjectWiseAnalysis',
  overallWeakerAreaAnalysis = 'overallAnalysis/weakerAreas',
  difficultyAnalysis = 'overallAnalysis/overallSubjectDifficultyAnalysis',
  chapterConceptAnalysis = 'overallAnalysis/overallChapterConceptAnalysis',
  timeAnalysis = 'overallAnalysis/overallTimeAnalysis',
  calculateOverallAnalysis = 'overallAnalysis/calculateOverallAnalysis',

  // Package Plan
  packagePlan = 'packagePlan/list',
  createPackage = 'packagePlan/create',
  updatePackagePlan = 'packagePlan/edit',
  deletePackagePlan = 'packagePlan/delete',
  archiveUnarchivePackagePlan = 'packagePlan/archiveAndUnarchive',
  getSinglePackagePlan = 'packagePlan/single',
  chapterPreData = 'packagePlan/chapterPreData',
  durationType = 'packagePlan/durationType/list',
  createTestPlan = 'packagePlan/testPlan/create',
  getTestPlans = 'packagePlan/testPlans',
  createChapterTestPlan = 'packagePlan/chapterTestPlan/create',
  createConceptTestPlan = 'packagePlan/conceptTestPlan/create',

  //payment
  postPaymentDetails = 'payment/postPaymentDetails',
  getPackagePlan = 'payment/getPackagePlan',

  //Ai related below
  aiChatWiseAiBot = 'ai/chatWiseAiBot',
  aiBots ='aiBot/list',
  aiBotAnswerByThreadId ='ai',
  aiPreviousChatHistory = 'ai/getChatHistory',
  //ai token
  aiToken = 'aiToken',
}

export default Apipoint;

// Header
export enum HeadersTitle {
  ACADEMIC_SETUP = 'Academic Setup',
  CONCEPT_WISE_ANALYSIS = 'Concept Wise Analysis',
  OVER_ALL_ANALYSIS = 'Overall Subject Wise Performance',
  CHAPTER_WISE = 'Chapter Wise Tests',
  LEADERBOARD = 'Leaderboard',
  EXAMS_LIST = 'Exams List',
  CONCEPT_TEST = 'Concept Test',
  ACCOUNT_SETTINGS = 'Account Settings',
  COUPON_LISTING = 'Coupon Lists'
}
//result
export enum ResultTitle {
  LEADERBOARD_SUBTITLE = 'Your Rank Will be Updated Tomorrow ',
  CONCEPT_WISE_ANALYSIS = 'Concept Wise Analysis',
  CHAPTER_WISE = 'Chapter Wise Tests'
}

//form
export enum FormType {
  SUBMIT = 'Submit',
  ADD = 'Add',
  EDIT = 'Edit',
  UPDATE = 'Update',
  VIEW = 'View',
  DELETE = 'Delete'
}

// Dialoge title
export enum DialogTitle {
  SUB = 'Subject',
  ADD_SUB = 'Add Subject',
  EDIT_SUB = 'Edit Subject',
  DELETE = 'Delete',
  PASSWORD = 'Password',

  SUBJECT = 'Subject',
  STREAM = 'Stream',
  ADD_STREAM = 'Add Stream',
  EDIT_STREAM = 'Edit Stream',
  ADD_STANDARD = 'Add Standard',
  EDIT_STANDARD = 'Edit Standard',
  STANDARD = 'Standard',
  GENERATE_TEST = 'Generate Test',
  MARKS = 'Marks',
  ADD_TESTTYPE = 'Add Test Type',
  EDIT_TESTTYPE = 'Edit Test Type',

  TESTTYPE = 'Test Type',
  PUBLISH = 'PUBLISH',
  UNPUBLISH = 'UNPUBLISH',

  CREATE_TEST = 'CREATE TESTS',
  EDIT_TEST = 'EDIT TESTS',
  ADD_SECTION = ' Add Section',
  EDIT_SECTION = 'Edit Section',
  SYLLABUS = 'Syllabus',
  BACK = 'Back',
  NEXT = 'Next',
  ACCURACY = 'Accuracy',
  RANK = 'Rank',
  SETTINGS = 'Settings',
  BOOKMARKS = 'Bookmarks',
  NOTES = 'Notes',
  DOWNLOADS = 'Downloads',
  LOGOUT = 'Log Out',

  // academic year
  ACADEMIC_YEAR = 'Academic Year',
  EDIT_ACADEMIC_YEAR = 'Edit Academic year',
  ADD_ACADEMIC_YEAR = 'Add Academic year',
  CHAPTERWISE_TEST = 'Chapter wise Test',
  CONCEPTWISE_TEST = 'Concept wise Test',

  CREATE_CAROUSEL = 'CREATE CAROUSEL',
  EDIT_CAROUSEL = 'EDIT CAROUSEL',

  CREATE_FOLDER = 'Create Folder',
  UPDATE_FOLDER = 'Update Folder'
}

// Form Fields
export enum FormFields {
  STANDARD = 'Standard',
  TESTTYPE = 'Test type',
  STREAM = 'Stream',
  SUB = 'Subject',
  DESC = 'Description',
  STD_STAT = 'Standard Status',
  TST_STAT = 'testtype Status',
  SUB_STAT = 'Subject Status',
  SUB_TEST = 'Test Type',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  ENTER_PASS = 'Enter Password',

  NO_DATA_MSG = 'No Data Found',
  TIME_SLOT = 'Time Slots',
  QUES_SLOT = 'Question Slots',
  QUES_TYPE = 'Question Type',
  TOTAL_TIME = 'Total Time',

  TOTAL_MARKS = 'Total Marks',
  NAME = 'NAME',
  STATUS = 'Status',
  SECTION_NAME = 'Section Name',
  NO_QUES = 'No of Questions',
  MAX_ATTEM = 'Max Attempts',
  ASSIGN_FACULTY = 'Assigned Faculty',
  MCQ_QUESTIONS = 'MCQ Questions',
  INT_QUESTIONS = 'Integer Questions',
  ADDRESS = 'Address',
  ZIP_CODE = 'Zip-Code',
  CITY = 'City',
  STATE = 'State',
  COUNTRY = 'Country',
  CLASS = 'Class',
  DOB = 'DOB',
  GENDER = 'Gender',
  PHONE_NUMBER = 'Phone Number',
  EMAIL_ID = 'Email ID',
  FULL_NAME = 'Full Name',
  MY_PROFILE = 'My Profile',
  PHOTO = 'Your Photo',
  PHOTO_DESCRIPTION = 'This will be displayed on your profile',
  DELETE = 'Delete',
  UPDATE = 'Update',
  CANCEL = 'Cancel',
  PERSONAL_INFO = 'Personal Information',
  EXAM = 'Exam',
  BILLING_DETAILS = 'Billing Details',
  Name = 'Name',
  START_TIME = 'Start Time',
  END_TIME = 'End Time',
  DURATION = 'Duration',
  MARKS = 'Marks',
  ASSIGN_TEST_TO_PACKAGE = 'Assign Test To The Package',
  RESUME = 'Resume',
  RETAKE = 'Retake',
  INSTANT_RESULT = 'Instant Result',
  SYLLABUS = 'Syllabus',
  MCQ = 'MCQ',
  INTEGER = 'Integer',

  // year
  START_DATE = 'Start Date',
  END_DATE = 'End Date',
  PROMOTION_PERCENTAGE = 'Level Promotion Percentage',
  QUESTION_COUNT = 'Question Count',
  TIME_PER_QUESTION = 'Time Per Question',
  QUESTION_PERCENTAGE = 'Question Percentage',

  PLAN_NAME = 'PLAN NAME',
  STD_UP = 'STANDARD',
  TEST_TYPES_UP = 'TEST TYPES',
  DESC_UP = 'DESCRIPTION',
  SECTION_MARK = 'Section Mark'
}

//refer and earn
export enum ReferAndEarnTitles {
  BENEFITED_DAYS = 'BENEFITED DAYS',
  REFERRAL_USED = 'REFERRAL USED',
  REFERRAL_LEVEL = 'REFERRAL LEVEL',
  REFER_EARN = 'Refer and Earn!',
  REFER_DISCRIPTION = 'Earn 5 All India Mock Test free for every new user that joins using your referral code . Your Friend also gets 5 All India Mock Test free !',
  REFER_MESSAGE = 'Invite a friend to TopAll',
  REFER_MESSAGE2 = 'That Friend Sign ups in TopAll',
  REFER_MESSAGE3 = 'After They finish their signing in Process , you both receive 5 All India Mock Test ! ',
  REFERRAL_LINK = 'Share your Referral Link',
  SOCIAL_MEDIA = 'Share via social media',
  GMAIL = 'Gmail',
  FACEBOOK = 'Facebook',
  INSTAGRAM = 'Instagram',
  WHATSAPP = 'Whatsapp'
}
//generate test
export enum GenerateTestType {
  QUOTES = 'Build your test and get to know your grade on your own.'
}
// toaster messages
export enum TosterMessages {
  ADMIN_IMG_UPLOAD_FAIL = 'Image upload failed, please try again',
  ADMIN_QUESTION_IMPORT_SUCCESS = 'Question Import successfully',
  ADMIN_SUB_UPDATE_SUCCESS = 'Subject updated successfully',
  ADMIN_SUB_UPDATE_FAIL = 'Subject updatation failed',
  ADMIN_SUB_TEST_SUCCESS = 'Test type updated successfully',
  ADMIN_TEST_FAIL = 'Test type updatation failed',
  ADMIN_IMPORT_FAIL_LIMT = 'Question Limit  Exceeds',
  ADMIN_IMPORT_FAIL = 'Question Import failed',
  ADMIN_DELETE_SUCCESS = 'Subject deleted successfully',
  ADMIN_SUB_DELETE_FAIL = 'Subject deletion failed',
  ADMIN_STREAM_UPDATE_SUCCESS = 'Stream updated successfully',
  ADMIN_TESTTYPE_UPDATE_SUCCESS = 'Test type updated successfully',
  ADMIN_TEST_TYPE_IN_USE = 'Test Type is already in use',
  ADMIN_TESTTYPEUPDATE_FAIL = 'Test type updatation failed',
  ADMIN_STREAM_UPDATE_FAIL = 'Stream updatation failed',
  ADMIN_STREAM_DELETE_SUCCESS = 'Stream deleted successfully',
  ADMIN_TEST_DELETE_SUCCESS = 'Test type deleted successfully',
  ADMIN_TEST_DELETE_FAIL = 'Test type deletion failed',
  ADMIN_STREAM_DELETE_FAIL = 'Stream deletion failed',
  ADMIN_SUB_ADD_SUCCESS = 'Subject added successfully',
  ADMIN_SUB_ADD_FAIL = 'Subject creation failed',
  ADMIN_IMG_UPLAOD_FAIL = 'Image upload failed',
  USER_PRRVIOUS_ERROR = 'Error fetching data',
  LEADER_BOARD_UPDATE = 'Leaderboard updated successfully ',
  LEADER_BOARD_UPDATE_FAIL = 'Failed to update leaderboard status. Please try again',
  LEADER_BOARD_UPDATE_ERR = 'Please try again',
  ADMIN_SUB_NAME_CONFLICT = 'Subject name already exists',
  ADMIN_STREAM_ADD_SUCCESS = 'Stream added successfully',
  ADMIN_TESTYPE_ADD_SUCCESS = 'Test type added successfully',
  ADMIN_STREAM_ADD_FAIL = 'Stream added failed',
  SOMETHING_WENT_WRONG = 'Something went wrong',
  ADMIN_COMMON_ERROR = 'Something went wrong, please try again later.',
  ADMIN_STD_CREATE_SUCCESS = 'Standard created successfully',
  ADMIN_STD_CREATE_FAIL = 'Standard creation failed',
  ADMIN_STD_UPDATE_SUCCESS = 'Standard updated successfully',
  ADMIN_STD_UPDATE_FAIL = 'Standard updatation failed',
  ADMIN_STD_DELETE_SUCCESS = 'Standard deleted successfully',
  ADMIN_STD_DELETE_FAIL = 'Standard deletion failed',
  ADMIN_STD_NAME_CONFLICT = 'Standard name already exists',

  ADMIN_TEST_CREATE_SUCCESS = 'Test type created successfully',
  ADMIN_TEST_CREATE_FAIL = 'Test type creation failed',
  ADMIN_TEST_UPDATE_SUCCESS = 'Test type updated successfully',
  ADMIN_TEST_UPDATE_FAIL = 'Test type updatation failed',

  ADMIN_TEST_NAME_CONFLICT = 'Test type name already exists',
  ADMIN_SYLLABUS_UPDATE_SUCCESS = 'Syllabus updated successfully',
  ADMIN_SYLLABUS_UPDATE_FAIL = 'Syllabus updatation failed',
  ADMIN_SYLLABUS_DELETE_SUCCESS = 'Syllabus deleted successfully',
  ADMIN_SYLLABUS_DELETE_FAIL = 'Syllabus deletion failed',
  ADMIN_SYLLABUS_ADD_SUCCESS = 'Syllabus added successfully',
  ADMIN_SYLLABUS_ADD_FAIL = 'Syllabus creation failed',
  ADMIN_TOPIC_UPDATE_SUCCESS = 'Topic updated successfully',
  ADMIN_TOPIC_UPDATE_FAIL = 'Topic updatation failed',
  ADMIN_CHAPTER_UPDATE_SUCCESS = 'Chapter updated successfully',
  ADMIN_CHAPTER_UPDATE_FAIL = 'Chapter updatation failed',
  ADMIN_SYLLABUS_FETCH_FAIL = 'Syllabus fetch failed, Try again later',
  ADMIN_SYLLABUS_CANT_VIEW = 'You cannnot view this syllabus',
  ADMIN_PASSWORD_ERROR = 'Invalid password. Please try again',
  INSTRUCTION_UPDATE_SUCCESS = 'Instructions updated successfully',

  ADMIN_EXAM_CREATE_SUCCESS = 'Test created successfully',
  ADMIN_EXAM_CREATE_FAIL = 'Test creation failed',
  ADMIN_EXAM_UPDATE_SUCCESS = 'Test updated successfully',
  ADMIN_EXAM_UPDATE_FAIL = 'Test updatation failed. Please try again',
  ADMIN_EXAM_DELETE_SUCCESS = 'Test deleted successfully',
  ADMIN_EXAM_DELETE_FAIL = 'Test deletion failed',
  ADMIN_EXAM_COMMON_ERROR = 'Something went wrong, please try again',
  ADMIN_EXAM_PUBLISHED_ERROR = 'Published exams cannot be deleted or updated.',

  ADMIN_QUESTION_ADD_SUCCESS = 'Questions added successfully',
  ADMIN_QUESTION_ADD_FAIL = 'Question addition failed',
  ADMIN_QUESTION_LIMIT_EXCEEDS = 'Already added maximum number of questions',
  ADMIN_QUESTION_SEARCH_FAIL = 'Searching failed, Please try again',
  ADMIN_QUESTIONS_UPDATE_SUCCESS = 'Questions updated successfully',
  ADMIN_QUESTIONS_UPDATE_FAILED = 'Questions updatation failed',
  ADMIN_QUESTIONS_GET_FAILED = 'Questions fetch failed',
  ADMIN_QUESTIONS_DELETE_SUCCESS = 'Questions deleted successfully',
  ADMIN_QUESTIONS_DELETE_FAILED = 'Questions deletion failed',
  ADMIN_QUESTIONS_NOT_LINKED = 'Please link syllabus to add questions',
  ADMIN_FEEDBACK_SUCCESS = 'Feedback submitted successfully',
  ADMIN_FEEDBACK_FAIL = ' Feedback submission failed',
  ADMIN_SECTION_CREATE_SUCCESS = 'Section created successfully',
  ADMIN_SECTION_UPDATE_SUCCESS = 'Section Updated successfully',
  ADMIN_SECTION_UPDATE_FAIL = 'Section updatation failed. Please try again',
  ADMIN_SECTION_CREATE_FAIL = 'Section updatation failed. Please try again',
  ADMIN_SECTION_DELETE_SUCCESS = 'Section deleted successfully',

  ADMIN_CAROUSEL_CREATE_SUCCESS = 'Carousel created successfully',
  ADMIN_CAROUSEL_CREATE_FAIL = 'Carousel creation failed',
  ADMIN_CAROUSEL_UPDATE_SUCCESS = 'Carousel updated successfully',
  ADMIN_CAROUSEL_UPDATE_FAIL = 'Carousel updatation failed. Please try again',
  ADMIN_CAROUSEL_DELETE_SUCCESS = 'Carousel deleted successfully',
  ADMIN_CAROUSEL_DELETE_FAIL = 'Carousel deletion failed',
  ADMIN_CAROUSEL_ORDER_SUCCESS = 'Carousel order updated successfully',
  ADMIN_CAROUSEL_ORDER_FAIL = 'Carousel order updation failed, please try again',

  // USER
  USER_FETCH_EXAM_FAIL = 'Failed to fetch exams. Please try again',
  SELECT_QUESTIONS = 'Selecting_Question',
  ADMIN_PUBLISH_ERROR = 'Please verify your start date and end date and try again.',
  ADMIN_PUBLISH_PASSWORD_ERROR = 'Incorrect password! Please try again.',
  ADMIN_PUBLISH_PASSWORD_STATUS = 'Failed to change publish status. Please try again.',
  ADMIN_PUBLISH_FAILED = 'Failed to change publish status',
  FEEDBACK_SUCCESS = 'FEEDBACK_SUCCESS',
  FEEDBACK_ERROR = 'FEEDBACK_ERROR',
  REPORT_SUCCESS = 'Issue reported successfully',
  REPORT_FAIL = 'Issue reporting failed, please try again',
  BOOKMARK_SUCCESS = 'Bookmark added successfully',
  BOOKMARK_ERROR = 'Bookmark addition failed, please try again',
  BOOKMARK_REMOVE_SUCCESS = 'Bookmark removed successfully',
  BOOKMARK_REMOVE_ERROR = 'Bookmark removal failed, please try again',
  BOOKMARK_FETCH_FAIL = 'Failed to fetch bookmarks. Please try again',

  //Profile
  IMAGE_UPLOAD_FAILED = 'Image upload failed',
  IMAGE_UPLOAD_ERROR = 'Error uploading image',
  PROFILE_UPDATE_SUCCESS = 'Profile updated successfully!',
  PROFILE_UPDATE_FAILED = 'Error updating profile. Please try again.',

  CAROUSEL_DELETE_SUCCESS = 'Carousel deleted successfully',
  CAROUSEL_DELETE_FAIL = 'Carousel deletion failed',

  FOLDER_DELETE_SUCCESS = 'Folder deleted successfully',

  FILE_DELETE_SUCCESS = 'File deleted successfully',
  FILE_DELETE_FAIL = 'File deletion failed',

  PLAN_CREATE_SUCCESS = 'Plan created successfully',
  PLAN_CREATE_FAIL = 'Plan creation failed',
  PLAN_UPDATE_SUCCESS = 'Plan updated successfully',
  PLAN_UPDATE_FAIL = 'Plan updatation failed. Please try again',
  PLAN_DELETE_SUCCESS = 'Package plan deleted successfully',
  PLAN_DELETE_FAIL = 'Package plan deletion failed. Please try again',
  PLAN_ARCHIVE_SUCCESS = 'Archived successfully',
  PLAN_ARCHIVE_FAIL = 'Archiving failed. Please try again',
  PLAN_UNARCHIVE_SUCCESS = 'Unarchived successfully',
  PLAN_UNARCHIVE_FAIL = 'Unarchiving failed. Please try again',

  UPCOMING_TEST_FETCH_FAIL = 'Failed to fetch upcoming tests. Please try again.',
  ADMIN_FACULTY_UPDATE_SUCCESS = 'Faculty updated successfully',
  ADMIN_FACULTY_ADD_SUCCESS = 'Faculty Created successfully',
  ADMIN_FACULTY_DELETE_SUCCESS = 'Faculty Deleted successfully'
}

//roles
export const enum Roles {
  SUPER_ADMIN = 'super-admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  STUDENT = 'student',
  FACULTY = 'faculty'
}

export const AdminOnlyGroups = [Roles.SUPER_ADMIN, Roles.ADMIN];
export const AdminGroups = [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.FACULTY];

// status code
export const enum StausCode {
  OK = 200
}

// session status
export enum SessionStatus {
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  LOADING = 'loading'
}

// errors
export enum Errors {
  SOMETHING_WENT_WRONG = 'Something went wrong',
  NOT_A_VALID_REFERRAL = 'Not a Valid Referral Code'
}

// Table names
export enum TableNames {
  STD = 'Standard'
}

//Buttons names
export enum ButtonNames {
  ADD_SUB = 'Add Subject',
  ADD_TEST = 'Add Test type',
  SHOW_ALL = 'Show All',
  CLEAR = 'Clear',
  CREATE_TEST = 'CREATE TEST',
  UPDATE_TEST = 'Update Test',
  VIEW_SYLLABUS = 'View Syllabus',
  SYLLABUS = 'Syllabus',
  STARTS_IN = 'Starts in',
  STARTS = 'Starts',
  START_TEST = 'Start Test',
  STARTS_ON = 'Starts On',
  UNLOCK = 'Unlock',
  PRACTICE = 'Practice',
  REPORT = 'Report',
  ATTEMPTS = 'Attempts',
  VIEW_REPORT = 'View Report',
  VIEW_ATTEMPTS = 'View Attempts',
  BACK = 'Back',
  CONTINUE = 'Continue',
  CORRECT = 'Correct',
  WRONG = 'Wrong',
  LEFT = 'Left',
  LEAVE_TEST = 'Leave Test',
  SAVE_AND_NEXT = 'Save & Next',
  SAVE_AND_MARK_FOR_REVIEW = 'Save & Mark For Review',
  MARK_FOR_REVIEW = 'Mark For Review',
  SUBMIT_TEST = 'Submit Test',
  FILTER_TEST = 'FILTER TESTS',
  REFRESH = 'Refresh',
  CALENDAR = 'Calendar',
  MARKS = 'Marks',
  ACCURACY = 'Accuracy',
  CREATE_CAROUSEL = 'Create Carousel',
  EDIT_CAROUSEL = 'Update Carousel',
  ADD_ACADEMIC_YEAR = 'Add Academic Year',
  CREATE_FOLDER = 'CREATE FOLDER',
  UPDATE_FOLDER = 'UPDATE FOLDER',
  EDIT = 'Edit',
  UPDATE = 'Update',
  DELETE = 'Delete',
  UPLOAD_FILE = 'Upload File',
  CREATE_FOLDER_SMALL = 'Create Folder',
  RESUME = 'Resume',
  RETAKE = 'Retake',
  CREATE_COUPONS = 'CREATE COUPONS',
  ADD = 'Add',
  CREATE_PLAN = 'Create Plan',
  ARCHIVE = 'Archive',
  UNARCHIVE = 'Unarchive',
  TOTAL_MARKS = 'Total Marks : ',
  SELECT_PLAN = 'Select Plan',
  PAUSE_AND_EXIT = 'Pause and Exit'
}
// Table Headers
// export enum

// Status Title
export enum StatusTitles {
  UPCOMING = 'Upcoming',
  COMPLETED = 'Completed',
  ONGOING = 'Ongoing'
}

// Status
export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

// Card Itmes
export enum CardItems {
  FEEDBACK_TITLE = ' What Seems to be the problem?',
  FEEDBACK_ERROR = 'Error submitting feedback',
  FEEDBACK_SUCCESS = 'Feedback Submission Success',
  QUESTIONS = 'Questions',
  MARKS = 'Marks',
  MINS = 'Mins',
  ENDS_ON = 'Ends On',
  COMPLETED = 'Test completed',
  NO_EXAM_FOUND = 'No Exams Available'
}
export enum MODELMessage {
  TITLE_ATTENTION = 'ATTENTION!',
  ANOTHERMES_ATTENTION = 'Dear Aspirant, as per the new Physics Section B pattern,you can attempt any 5 out of 10 questions from this section',
  ANOTHERMES_ATTENTION2 = 'To attempt this question, please remove our answer from any one of the 5 previously attempted questions.',
  TITLE_REPORT = 'Issue Reported',
  LEAVE_TEST = 'Are you sure want to leave the test ?',
  BOOKMARK_TAP = 'Are you sure, want to remove the bookmark',
  TITLE_REMOVE = ' Remove Bookmark',
  TITLE = 'Malicious activities detected',
  TAB_CHNAGED = 'You have changed the tab, If you try another time test will be submitted',
  AnotherMessage = 'Your session has expired. Please reload the page.'
}
// Test Instructions
export const INSTRUCTIONS = [
  'Each correct answer is awarded +4 marks and the wrong answers are offered a -1 mark',
  'To submit the question, click on "submit & next"',
  'To clear the answer, click "clear"',
  'The question palette will show the status of each question with the following symbols:'
];

// Test Indicators
export const INDICATORS = [
  { title: 'Not Visited', color: '#6F6F6F' },
  { title: 'Not Answered', color: '#FF4747' },
  { title: 'Mark For Review', color: '#935AFD' },
  { title: 'Answered', color: '#00A86B' },
  { title: 'Answered & Marked for Review', color: '#FF6800' }
];

export enum OverAllSubectPerformance {
  CORRECT = 'Correct',
  WRONG = 'Wrong',
  LEFT = 'Left'
}

export enum TestInstructions {
  READ_INSTRUCTIONS = 'Please read the instructions carefully to attempt the generated test!',
  TEST_WILL_AUTOMATICALLY_SUBMITED = 'The test will be automatically submitted and moved to the result page when the time ends',
  GENRL_INSTRUCTIONS = 'General Instructions',
  NOTE = 'Note:'
}

export enum OEExamItems {
  NOT_VISITED = 'Not Visited',
  NOT_ANSWERED = 'Not Answered',
  MARK_FOR_REVIEW = 'Mark For Review',
  ANSWERED = 'Answered',
  ANSWRD_AND_MRKD_FOR_REVIEW = 'Answered & Marked for Review',
  REFRESH_THW_PAGE_INSTRUCTION = 'If the page is taking more than a minute to load questions please refresh the page.',
  READ_INSTRUCTIONS = 'Please read the instructions carefully to attempt the generated test!',
  TEST_WILL_AUTOMATICALLY_SUBMITED = 'The test will be automatically submitted and moved to the result page when the time ends',
  GENRL_INSTRUCTIONS = 'General Instructions',
  NOTE = 'Note:',
  REPORT = 'Report',
  BOOKMARK = 'Bookmark',
  REFRESH = 'Refresh',
  MULTIPLE_CHOICE_QUESTIONS = 'Multiple Choice Questions',
  INTEGER_QUESTIONS = 'Integer Questions'
}

export enum DownloadsConstants {
  SYLLABUS = 'Syllabus Files',
  VIEW_ALL = 'View All',
  RECENT_FILES = 'Recent Files',
  PREVIEW = 'Preview',
  DOWNLOADS = 'Download',
  FILE_PREVIEW = 'File Preview'
}

export enum AnsweredTypes {
  CORRECT = 'correct',
  WRONG = 'wrong',
  LEFT = 'left'
}

export enum ReferralItems {
  NO_REFERRALS_FOUND = 'No referrals found',
  FRIENDS_U_REFERRED = `Friends you've referred`,
  GAINED_5_AIMT = 'Gained 5 All India Mock Test',
  END_DATE = 'END DATE',
  START_DATE = 'START DATE',
  DAYS_BENEFITING = 'DAYS BENEFITING',
  BENEFITTING_REFERRER = 'Benefitting Days - Referrer',
  BENEFITTING_REFEREE = 'Benefitting Days - Referee',
  TESTS_REFERRER = 'Benefitting Tests - Referrer',
  TESTS_REFEREE = 'Benefitting Tests - Referee',
  LEVEL = 'LEVEL',
  STREAM = 'STREAM',
  ADD_BENEFITS = 'Add Benefits',
  EDIT_BENEFITS = 'Edit Benefits',
  LAST_MONTH = 'Last Month',
  EXPIRED = 'Expired'
}

export enum FacultyTitle {
  CREATE_FACULTY = 'Create Faculty',
  FACULTY_NAME = 'Faculty Name',
  MOBILE_NUMBER = ' Mobile Number',
  ROLE = 'Role',
  SUBJECT_AUTHORISED = 'Subject Authorised',
  EXPERT_FACULTY = 'Expert Faculty',
  ADD_FACULTY = 'Add Faculty'
}

export const Level: { [key: string]: number } = {
  easy: 1,
  medium: 2,
  hard: 3
};

// Table Headers
export const enum TableHeaders {
  ID = 'ID',
  DEVICE = 'DEVICE',
  STUDENT_NAME = 'STUDENT NAME',
  SCREEN_TIME = 'SCREEN TIME',
  TESTS_TAKEN = 'TESTS TAKEN',
  QUESTIONS = 'QUESTIONS',
  SINCE = 'SINCE',
  LAST_SEEN = 'LAST SEEN',
  STATUS = 'STATUS'
}

export enum SubscriptionTitles {
  ADD_SUBSCRIPTION = ' Add Subscription'
}

export enum InfluencerTitles {
  FROM_LAST_MONTH = 'From Last Month',
  INFLUENCER_NAME = 'Influencer Name',
  CREATE_REFERRAL_CODE = 'Create Referral Code',
  SOCIAL_MEDIA = 'Social Media',
  ADD_INFLUENCER = ' Add',
  SELECT_END_DATE = 'Select End Date',
  SELECT_START_DATE = 'Select Start Date',
  YOUTUBE = 'YouTube',
  INSTAGRAM = 'Instagram',
  CREATE_INFLUENCER = 'CREATE INFLUENCER',
  FILTER = 'Filter'
}

export type PackagePlanPayload = {
  name: string;
  description?: string;
  standardList: number[];
  streamId: number;
};

// A single standard
type Standard = {
  id: number;
  name: string;
};

// A single package plan
export type IPackagePlan = {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  standardList: Standard[];
};

// The outer structure for each stream (NEET, JEE, etc.)
export type IPackagePlans = {
  streamId: number;
  streamName: string;
  packagePlans: IPackagePlan[];
};
