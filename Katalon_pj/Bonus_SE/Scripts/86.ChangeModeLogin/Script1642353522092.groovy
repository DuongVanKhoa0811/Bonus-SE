import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import static com.kms.katalon.core.testobject.ObjectRepository.findWindowsObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.cucumber.keyword.CucumberBuiltinKeywords as CucumberKW
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testng.keyword.TestNGBuiltinKeywords as TestNGKW
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.windows.keyword.WindowsBuiltinKeywords as Windows
import internal.GlobalVariable as GlobalVariable
import org.openqa.selenium.Keys as Keys

WebUI.openBrowser('')

WebUI.navigateToUrl('http://localhost:8080/')

WebUI.click(findTestObject('Object Repository/Page_Element/div_Sign In'))

WebUI.selectOptionByValue(findTestObject('Object Repository/Page_Element/select_UsernameEmail addressPhone'), 'login_field_email', 
    true)

WebUI.setText(findTestObject('Object Repository/Page_Element/input_Sign in with_mx_Field_4'), 'ẻt')

WebUI.setEncryptedText(findTestObject('Object Repository/Page_Element/input_Email_password'), 'O4oqav5YnXg=')

WebUI.click(findTestObject('Object Repository/Page_Element/input_Forgot password_mx_Login_submit'))

WebUI.selectOptionByValue(findTestObject('Object Repository/Page_Element/select_UsernameEmail addressPhone'), 'login_field_mxid', 
    true)

WebUI.setText(findTestObject('Object Repository/Page_Element/input_Sign in with_username'), 'ptnha19')

WebUI.click(findTestObject('Object Repository/Page_Element/div_Sign inHomeservermatrix.orgEditJoin mil_eab958'))

WebUI.setEncryptedText(findTestObject('Object Repository/Page_Element/input_Email_password'), '5R3Ima4A+eOeCrCDRGMLmJpaGR3V3+YI')

WebUI.click(findTestObject('Object Repository/Page_Element/div_Forgot password'))

WebUI.click(findTestObject('Object Repository/Page_Element/a_Sign in instead'))

WebUI.setText(findTestObject('Object Repository/Page_Element/input_Sign in with_username_1'), 'ptnha19')

WebUI.setEncryptedText(findTestObject('Object Repository/Page_Element/input_Username_password'), '5R3Ima4A+eOeCrCDRGMLmJpaGR3V3+YI')

WebUI.click(findTestObject('Object Repository/Page_Element/input_Forgot password_mx_Login_submit'))

WebUI.click(findTestObject('Object Repository/Page_Element/div_Verify with Security Key'))

WebUI.setEncryptedText(findTestObject('Object Repository/Page_Element/input_Security Key_mx_Field_12'), 'PF4jXtbe/5x5+S5PgN4Kl/QbANAkWZYKqKaG9gW6gn+Po31AOnak0DX8GoEzAUkskgpeON1UhfEqZG0XXngJPA==')

WebUI.click(findTestObject('Object Repository/Page_Element/button_Continue'))

WebUI.click(findTestObject('Object Repository/Page_Element/div_Done'))

WebUI.closeBrowser()

