package com.mp.MPlayer;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class LoginTest {

    static WebDriver driver;

    @BeforeAll
    public static void setUp(){
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.get("http://localhost:8080/login.html");
    }

    @Test
    public void loginTest(){
        WebElement usernameInput = driver.findElement(By.id("username"));
        usernameInput.clear();
        usernameInput.sendKeys("Reljo");

        WebElement passwordInput = driver.findElement(By.id("password"));
        passwordInput.clear();
        passwordInput.sendKeys("Reljo");

        driver.findElement(By.tagName("button")).click();

        String expected = "Logout";
        String actual = driver.findElement(By.className("logout")).getText();

        assertEquals(actual, expected);
    }

    @AfterAll
    public static void tearDown(){
        driver.quit();
    }
}
