package com.mp.MPlayer;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertEquals;

//CURRRRRRRRRSSSSSEDDDD
public class RegisterTest {

    static WebDriver driver;

    @BeforeAll
    public static void setUp(){
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.get("http://localhost:8080/register.html");
    }

    @Test
    public void registerTest(){
        String user = "registerTest";
        String email = "test@gmail.com";
        String pass = "passwordTest";

        WebElement usernameInput = driver.findElement(By.id("username"));
        usernameInput.clear();
        usernameInput.sendKeys(user);

        WebElement emailInput = driver.findElement(By.id("email"));
        emailInput.clear();
        emailInput.sendKeys(email);

        WebElement passwordInput = driver.findElement(By.id("password"));
        passwordInput.clear();
        passwordInput.sendKeys(pass);

        driver.findElement(By.tagName("button")).click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(2));
        WebElement link = wait.until(ExpectedConditions.elementToBeClickable(By.tagName("a")));
        link.click();

        driver.findElement(By.id("username")).sendKeys(user);
        driver.findElement(By.id("password")).sendKeys(pass);

        driver.findElement(By.tagName("button")).click();

        wait.until(ExpectedConditions.elementToBeClickable(By.className("logout")));

        String expected = "Logout";
        String actual = driver.findElement(By.className("logout")).getText();

        assertEquals(actual, expected);
    }

    @AfterAll
    public static void tearDown(){
        driver.quit();
    }

//    KILL ME PLS
//
//    private static Connection connection;
//    private static WebDriver driver;
//
//    @BeforeAll
//    public static void setUp() throws ClassNotFoundException, SQLException {
//        driver = new ChromeDriver();
//        driver.manage().window().maximize();
//        driver.get("http://localhost:8080/register.html");
//
//        String databaseURL = "jdbc:h2:mem:testdb";
//        String user = "sa";
//        String password = "a";
//
//        Class.forName("org.h2.Driver");
//        System.out.println("Connecting to Database");
//        connection = DriverManager.getConnection(databaseURL, user, password);
//        connection.setAutoCommit(true);
//
//    }
//
//    @Test
//    public void registerTest() {
//        WebElement usernameInput = driver.findElement(By.id("username"));
//        usernameInput.clear();
//        usernameInput.sendKeys("registerTest");
//
//        WebElement emailInput = driver.findElement(By.id("email"));
//        emailInput.clear();
//        emailInput.sendKeys("test@gmail.com");
//
//        WebElement passwordInput = driver.findElement(By.id("password"));
//        passwordInput.clear();
//        passwordInput.sendKeys("passwordTest");
//
//        driver.findElement(By.tagName("button")).click();
//
//        try {
//            Thread.sleep(1000);
//        } catch (InterruptedException e) {
//            throw new RuntimeException(e);
//        }
//
//        String query = "SELECT * FROM MEMBER";
//
//        try (Statement statement = connection.createStatement();
//             ResultSet resultSet = statement.executeQuery(query)) {
//
//            while (resultSet.next()) {
//                int customerId = resultSet.getInt("id");
//                String customerName = resultSet.getString("name");
//                String customerEmail = resultSet.getString("email");
//                String customerPassword = resultSet.getString("password");
//
//                System.out.println("Customer ID: " + customerId + ", Name: " + customerName + ", Email: " +
//                        customerEmail + ", Password: " + customerPassword);
//            }
//
//        } catch (SQLException error) {
//            error.printStackTrace();
//        }
//    }
//
//    @AfterAll
//    public static void tearDown() throws SQLException {
//        if (connection != null) {
//            connection.close();
//        }
//        if (driver != null) {
//            driver.quit();
//        }
//    }
}
