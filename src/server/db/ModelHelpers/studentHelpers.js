import StudentModel from '../QueryModels/StudentModel';
import { upload } from '../../cloudinary/cloudHelpers';
import { storeInGallery, recognize, galleryRemoveUser } from '../../kairosFR/kairosHelpers';
import { sendMailForArrival } from '../../mailgun/mailGunHelpers';
import moment from 'moment';

const Student = new StudentModel();

exports.addToClass = async (req, res) => {
  try {
    var added = false;
    const classNames = req.body.selectedClass.split(',');
    for (let i = 0; i < classNames.length; i++) {
      req.body.selectedClass = classNames[i];
      let { studentPhoto, studentUserName, selectedClass } = req.body;
      let [ enrolled ] = await Student.checkIfStudentIsEnrolled(studentUserName, selectedClass);
      /* istanbul ignore else  */
      if (enrolled.length === 0) {
        const { url } = await upload(req.body);
        await Student.updateUser(url, studentUserName);
        await Student.addToClass(studentUserName, selectedClass);
        await storeInGallery(studentUserName, selectedClass, url);
        added = true;
      }
    }
    /* istanbul ignore else  */
    if (added) {
      res.sendStatus(201);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    /* istanbul ignore next  */
    res.status(500).send(err.message);
  }
};

exports.removeFromClass = async (req, res) => {
  try {
    const classNames = req.body.className.split(',');
    for (let i = 0; i < classNames.length; i++) {
      req.body.className = classNames[i];
      await Student.removeFromClass(req.body);
      await galleryRemoveUser(req.body);
    }
    res.sendStatus(200);
  } catch (err) {
    /* istanbul ignore next  */
    res.status(500).send(err.message);
  }
};

exports.checkInStudents = async (req, res) => {
  try {
    const { url } = await upload(req.body);
    const matches = await recognize(url);
    const date = await moment().format('YYYY-MM-DD HH:mm:ss');
    const [matchedUsers] = await Student.getMatchedUsers(matches);
    for (let i = 0; i < matchedUsers.length; i++) {
      let userId = matchedUsers[i].users_id;
      let [cutOffDate] = await Student.getAttendanceStatus(userId, date.slice(0, 10))
      if (cutOffDate[0].status === 'Pending') {
        await Student.checkInOnTime(userId, date);
      } else {
        matchedUsers.splice(i, 1);
        i--;
      }
    }
    sendMailForArrival(matchedUsers);    
    res.sendStatus(201);
  } catch (err) {
    /* istanbul ignore next  */
    res.status(500).send(err.message);
  }
};

exports.getByClass = async (req, res) => {
  try {
    const className = req.query.class;
    const students = await Student.getStudentsByClass(className);
    res.status(200).send(students[0]);
  } catch (err) {
    /* istanbul ignore next  */
    res.status(500).send(err.message);
  }
};

