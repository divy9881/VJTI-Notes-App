use vjti_app;

CREATE TABLE NOTES(
	userId int,
    note varchar(2000),
    FOREIGN KEY(userId) REFERENCES CREDENTIALS(userId)
);