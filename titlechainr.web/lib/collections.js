Titles = new FilesCollection({
  collectionName: 'Titles',
  storagePath: 'data',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    console.log(file);
    if (file.size <= 10485760 && /pdf/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload pdf, with size equal or less than 10MB';
    }
  }
});

Registry = new Mongo.Collection('Registry');