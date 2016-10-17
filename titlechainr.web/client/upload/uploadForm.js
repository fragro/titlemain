import { Session } from 'meteor/session'

import './uploadForm.html';

Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  },
  processing: function(){
    return Session.get("processing");
  }
});

Template.uploadForm.events({
  'change #fileInput': function (e, template) {
    console.log(e.currentTarget.files);
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      for(var i in e.currentTarget.files){
        var tFile = e.currentTarget.files[i];
        if(tFile["name"] && tFile["name"] != "item"){
          console.log(tFile["name"]);
          // We upload only one file, in case 
          // multiple files were selected
          var upload = Titles.insert({
            file: tFile,
            streams: 'dynamic',
            chunkSize: 'dynamic',
            fileName: tFile["name"]
          }, false);

          upload.on('start', function () {
            console.log('start');
            template.currentUpload.set(this);
            Session.set("processing", "Uploading...");
          });
          upload.on('end', function (error, fileObj) {
            if (error) {
              alert('Error during upload: ' + error);
            } else {
              updateProcessingChip("Upload Complete");
              //initiate processing
              processPDF(fileObj);
              //alert('File "' + fileObj.name + '" successfully uploaded');
            }
            template.currentUpload.set(false);
          });
          upload.start();
        }
      }
    }
  }
});