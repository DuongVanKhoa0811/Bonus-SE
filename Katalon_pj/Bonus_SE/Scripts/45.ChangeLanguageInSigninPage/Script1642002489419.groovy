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

WebUI.click(findTestObject('Object Repository/Page_Element/div_English (US)'))

WebUI.setText(findTestObject('Object Repository/Page_Element/input_Catal_mx_LanguageDropdown_input'), 'Ti')

WebUI.click(findTestObject('Object Repository/Page_Element/div_Ting Vit'))

WebUI.setText(findTestObject('Object Repository/Page_Element/input_ng nhp vi_username'), 'ptnha19')

WebUI.setEncryptedText(findTestObject('Object Repository/Page_Element/input_Tn ti khon_password'), '5R3Ima4A+eOeCrCDRGMLmJpaGR3V3+YI')

WebUI.click(findTestObject('Object Repository/Page_Element/input_Qun mt khu_mx_Login_submit'))

WebUI.click(findTestObject('Object Repository/Page_Element/div_Xc minh bng Kha Bo mt'))

WebUI.setEncryptedText(findTestObject('Object Repository/Page_Element/input_Cha kha bo mt_mx_Field_4'), 'PF4jXtbe/5x5+S5PgN4Kl/QbANAkWZYKqKaG9gW6gn+Po31AOnak0DX8GoEzAUkskgpeON1UhfEqZG0XXngJPA==')

WebUI.click(findTestObject('Object Repository/Page_Element/button_Tip tc'))

WebUI.click(findTestObject('Object Repository/Page_Element/div_Xong'))

WebUI.click(findTestObject('Object Repository/Page_Element/img_Kim tra li_mx_BaseAvatar_image'))

WebUI.closeBrowser()

