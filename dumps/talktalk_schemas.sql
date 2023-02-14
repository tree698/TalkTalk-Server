-- MySQL dump 10.13  Distrib 8.0.29, for macos12 (x86_64)
--
-- Host: localhost    Database: talktalk
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tweets`
--

DROP TABLE IF EXISTS `tweets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tweets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` text NOT NULL,
  `workId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `tweets_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tweets`
--

LOCK TABLES `tweets` WRITE;
/*!40000 ALTER TABLE `tweets` DISABLE KEYS */;
INSERT INTO `tweets` VALUES (70,'Humm... it\'s simple',63,'2023-02-07 12:37:16','2023-02-07 12:37:16',250),(71,'Yea.. I know',63,'2023-02-07 12:38:09','2023-02-07 12:38:09',248),(72,'what kind of perfume?',64,'2023-02-07 12:38:34','2023-02-07 12:38:34',248),(73,'Nice guy~',66,'2023-02-08 14:09:11','2023-02-08 14:09:11',253),(74,'Looks lik chanel',64,'2023-02-08 14:10:17','2023-02-08 14:10:17',253),(75,'Wow wonderful',65,'2023-02-08 14:10:42','2023-02-08 14:10:42',253),(76,'I think too many lines make confusing',64,'2023-02-09 09:33:15','2023-02-09 09:33:15',253),(77,'Hi Craig, cause you dont know how to draw finger, the right hand is nothing?',66,'2023-02-09 11:42:45','2023-02-09 11:42:45',253),(78,'Yea, I agree it. Too many lines are not good.',64,'2023-02-09 12:03:47','2023-02-09 12:03:47',250),(79,'want you to practice one-line-drawing',64,'2023-02-10 00:35:08','2023-02-10 00:35:08',253),(80,'Okay. but plz explain to me what is one-line-drawing',64,'2023-02-10 00:36:28','2023-02-10 00:36:28',250),(81,'Plz, ask to GOOGLE, haha~',64,'2023-02-10 00:38:10','2023-02-10 00:38:10',253),(137,'Yes, only three colors and simple shape',63,'2023-02-11 08:29:01','2023-02-11 08:29:01',248),(153,'it\'s awesome!!!!!! ^^',112,'2023-02-11 11:06:00','2023-02-11 11:06:00',248),(154,'Olga~ You did a great job...',110,'2023-02-11 11:07:27','2023-02-11 11:07:27',248),(155,'S~~~~~o, CUTE ^^',106,'2023-02-11 11:08:08','2023-02-11 11:08:08',248),(156,'love AVOCADO. I eat it everyday~',102,'2023-02-11 11:08:59','2023-02-11 11:08:59',248),(157,'yes, I agree. it is beautiful',112,'2023-02-11 11:09:57','2023-02-11 11:09:57',249),(158,'ALSO HATE COVID.....',111,'2023-02-11 11:10:20','2023-02-11 11:10:20',249),(159,'I believe you can sell it.',110,'2023-02-11 11:10:42','2023-02-11 11:10:42',249),(160,'Hahahahaha~',106,'2023-02-11 11:10:56','2023-02-11 11:10:56',249),(161,'What is 화성?',103,'2023-02-11 11:11:14','2023-02-11 11:11:14',249),(162,'me too.',102,'2023-02-11 11:11:28','2023-02-11 11:11:28',249),(164,'Blue sky is good',98,'2023-02-11 11:12:32','2023-02-11 11:12:32',250),(165,'Blue sky is good',69,'2023-02-11 11:12:46','2023-02-11 11:12:46',250),(166,'GREATE~~~',112,'2023-02-11 11:12:59','2023-02-11 11:12:59',250),(167,'Awesome',110,'2023-02-11 11:13:12','2023-02-11 11:13:12',250),(168,'화성 is Korean language... meaning is Mars.. ^^',103,'2023-02-11 11:13:39','2023-02-11 11:13:39',250),(169,'Unforunately, avocado is expensive here..',102,'2023-02-11 11:14:41','2023-02-11 11:14:41',252),(170,'How long did you take time to complete it?',112,'2023-02-12 03:28:21','2023-02-12 03:28:21',251),(171,'G~~~REATE~~~!!!',110,'2023-02-12 03:29:01','2023-02-12 03:29:01',251),(173,'HOW DID YOU KNOW THAT IS KOREAN LANGUAGE?',103,'2023-02-12 03:29:40','2023-02-12 03:29:40',251),(174,'Joans: Almost one month!',112,'2023-02-12 03:30:50','2023-02-12 03:30:50',252),(175,'Only Craig knows that is KOREAN',103,'2023-02-12 03:31:21','2023-02-12 03:31:21',252);
/*!40000 ALTER TABLE `tweets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(128) NOT NULL,
  `email` varchar(45) NOT NULL,
  `photo` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=289 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (248,'Christina','$2b$11$2/YLMzNPwH4Y5ON6slghU.nT7zgxqTvNU7LqAfDJHWyAAYsvPoZS6','kkk@naver.com','1675771433006_christina-wocintechchat.jpg'),(249,'Christopher','$2b$11$QYpdx5i1ghFeOIo2fwxMYOqnSkHnn16vuuS79ESVOoQ.b8eHevLh.','kkk@naver.com','1675771474087_christopher-campbell.jpg'),(250,'Craig','$2b$11$yYZQ7u0xy.uOZqpwBIomjuaRDSuC7aZvPf3/8GgDYqeKfC6DghM4e','kkk@naver.com','1675771517047_craig-mckay.jpg'),(251,'Jonas','$2b$11$cqmYd/SQrhqVackdw20Q7eKsTRz40baaDUHKV7yaeB6UH1fda1ZAO','kkk@naver.com','1675771573632_jonas-kakaroto.jpg'),(252,'Kelly','$2b$11$gnES5TDfnMP1hCV/POWp3OSXTWddeuIdWUfBQOadAFmUL2Hwffq1K','kkk@naver.com','1675771618215_kelly-sikkema.jpg'),(253,'Olga','$2b$11$Yne8E3/aiKVr2zm0LteZf.6PNPZVrFGDhlMPwQdxZ3AAxJU13Sd16','kkk@naver.com','1675771648825_olga-zabegina.jpg'),(254,'Sergio','$2b$11$eWtRZkGCK0yjf/5LE5F7vuBdOBUN5BFxACO631YwsTUtip38DzZK2','kkk@naver.com','1675771676543_sergio-de-paula.jpg'),(288,'테스트','$2b$11$kNsCk6qDs4RIpsG9j/Bjtu2LI1QLMOPdXAwm/EL8066lk5bZFG152','test@gmail.com','1676341292920_test.jpg');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `works`
--

DROP TABLE IF EXISTS `works`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `works` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(256) NOT NULL,
  `description` text NOT NULL,
  `brush` varchar(256) NOT NULL,
  `originalName` varchar(256) NOT NULL,
  `fileName` varchar(256) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `works_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `works`
--

LOCK TABLES `works` WRITE;
/*!40000 ALTER TABLE `works` DISABLE KEYS */;
INSERT INTO `works` VALUES (63,'Simple Avocado','My first drawing. I don\'t know how to draw the contrast. Want to learn... Plz, somebody tell me. ^^','HB Pencile, Brush','avocado.png','1675773050274_avocado.png','2023-02-07 12:33:26','2023-02-07 12:33:26',248),(64,'Elegant Perfum','Thank you for giving me comments in advance.','Pencile, Brush','perfume.png','1675773297313_perfume.png','2023-02-07 12:36:33','2023-02-07 12:36:33',250),(66,'Thinking','It\'s hard for me to draw fingers. Will somebody teach me OR show me where I can learn it.','Soft brush, Acrylic pen','my_friend.png','1675861048168_my_friend.png','2023-02-08 13:02:54','2023-02-08 13:02:54',250),(68,'MONSTER','.... Nothing','Painting','Monstera.png','1675927921980_Monstera.png','2023-02-09 07:32:29','2023-02-09 07:32:29',254),(69,'Blue Sky with Ballon','My first work.','Brush, Pencil','hot_air_balloon.png','1675927987687_hot_air_balloon.png','2023-02-09 07:34:49','2023-02-09 07:34:49',252),(98,'LOVE VIERNAM','Miss Vietnam~ Want to visit VN again.','Color Pencile','vietnam.png','1676096127829_vietnam.png','2023-02-11 06:16:29','2023-02-11 06:16:29',249),(99,'CRYSTAL BALL','One day I watched a video to teach how to paint a crystal ball. I just follow it. How is it?','Painting brush','Snow_Ball.png','1676096210281_Snow_Ball.png','2023-02-11 06:18:23','2023-02-11 06:18:23',249),(100,'TIGER','I focused on color contrast and manging space. Tell me your idea. Thank you.','Soft Brush, Micro Pen','Roar.png','1676096368724_Roar.png','2023-02-11 06:20:43','2023-02-11 06:20:43',251),(101,'Dolphins','Just a draft version.  Tell me about your idea. thanks','HB Pencile','Dolphin.png','1676096456757_Dolphin.png','2023-02-11 06:22:10','2023-02-11 06:22:10',251),(102,'AVOCADO','I know it is so simple. Just personal pratice. Let me know how to improve my drawing skills','Forgot it. Sorry','avocado.png','1676096596837_avocado.png','2023-02-11 06:24:32','2023-02-11 06:24:32',253),(103,'Rocket to go Mars','.................. ^^','6B Pencile','Mars.png','1676096683220_Mars.png','2023-02-11 06:25:17','2023-02-11 06:25:17',253),(106,'DOLPHINE','nothing to say.... thank you','simple pencile','Dolphin.png','1676097207494_Dolphin.png','2023-02-11 06:34:15','2023-02-11 06:34:15',254),(110,'BLUE MONACO','It took a week to draw it. Welcome any opinion or criticism. Myself.... quite an open mind.','forgot it. Sorry~','Blue_Monaco.png','1676097832725_Blue_Monaco.png','2023-02-11 06:44:24','2023-02-11 06:44:24',253),(111,'Hate CORONA~','Everyone should be careful about COVID. Vacation is absolutely necessary.','colored pen & brush','corona_prevention.png','1676097933146_corona_prevention.png','2023-02-11 06:46:43','2023-02-11 06:46:43',248),(112,'Beautiful Garden','It took a week to draw it. Welcome any opinion or criticism. Myself.... quite an open mind.','Pastel pencil','Field_of_Dreams.png','1676098039770_Field_of_Dreams.png','2023-02-11 06:49:06','2023-02-11 06:49:06',252);
/*!40000 ALTER TABLE `works` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-14 12:29:11
