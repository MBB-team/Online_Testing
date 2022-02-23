SET NAMES utf8;

DELETE FROM databaseEmo.participant WHERE participantID IN ('user1', 'user2');

INSERT INTO databaseEmo.participant(participantID, active) VALUES('user1', 1);

INSERT INTO databaseEmo.participant(participantID, active) VALUES('user2', 1);
