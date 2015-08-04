package surepark.com.surepark;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
//import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import android.telephony.SmsManager;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

//import org.apache.commons.logging.Log;

public class MainActivity extends Activity {
//    WebView webViewKo = (WebView) findViewById(R.id.webView);
//    private static final String TAG = MainActivity.class.getSimpleName();
    WebView webViewKo;
    WebSettings webSettings;
    TelephonyManager tm;
    String number;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        setContentView(R.layout.activity_main);
        tm = (TelephonyManager)getSystemService(TELEPHONY_SERVICE);
        number = tm.getLine1Number();
//        Toast.makeText(getApplicationContext(), "number : "+number, Toast.LENGTH_LONG).show();
        webViewKo = (WebView) findViewById(R.id.webView);
        webViewKo.setWebChromeClient(new WebChromeClient());
        webViewKo.setWebViewClient(new WebViewClient());
        webSettings = webViewKo.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setGeolocationEnabled(true);
        webSettings.setDomStorageEnabled(true);
        JSInterface jsInt = new JSInterface(this);
        webViewKo.addJavascriptInterface(jsInt, "Android");
//        webViewKo.loadUrl("http://52.74.37.165/");
        webViewKo.loadUrl("file:///android_asset/www/index.html");
    }
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if(event.getAction() == KeyEvent.ACTION_DOWN){
            switch(keyCode)
            {
                case KeyEvent.KEYCODE_BACK:
                    if(webViewKo.canGoBack()){
                        webViewKo.goBack();
                    }else{
                        finish();
                    }
                    return true;
            }

        }
        return super.onKeyDown(keyCode, event);
    }

    public class JavaScriptInterface {
        Context mContext;
        private Activity activity;
        public JavaScriptInterface(Activity act) {
            this.activity = act;
        }
        /** Instantiate the interface and set the context */
        JavaScriptInterface(Context c) {
            mContext = c;
        }
        @JavascriptInterface
        public Boolean testIfAndroid(){
            return true;
        }
        @JavascriptInterface
        public String getNumber() {
//            Toast.makeText(getApplicationContext(),"gethow to  number was called : "+number,Toast.LENGTH_LONG).show();
            return number;
        }
        @JavascriptInterface
        public void sendSMS() {
    String phoneNumber = "09361239646";
    String message = "Sample";

    SmsManager smsManager = SmsManager.getDefault();
    try {
        smsManager.sendTextMessage(phoneNumber, null, message, null, null);
        Toast.makeText(getApplicationContext(), "sending to: " + phoneNumber, Toast.LENGTH_LONG).show();
    } catch (IllegalArgumentException e) {
        Toast.makeText(getApplicationContext(), "error" + e, Toast.LENGTH_LONG).show();
    }
//            ArrayList<String> parts = smsManager.divideMessage(message);
//            smsManager.sendMultipartTextMessage(phoneNumber, null, parts, null, null);
        }
        @JavascriptInterface
        public void getPosition() {
            LocationManager mLocManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
            Criteria criteria = new Criteria();
            LocationListener mlocListener = new MyLocationListener();
            criteria.setAccuracy(Criteria.ACCURACY_COARSE);
            criteria.setAltitudeRequired(false);
            criteria.setBearingRequired(false);
            criteria.setCostAllowed(true);
            criteria.setPowerRequirement(Criteria.NO_REQUIREMENT);

//            String providerName = mLocManager.getBestProvider(criteria,true);
            String providerName = (mLocManager.isProviderEnabled(mLocManager.NETWORK_PROVIDER) ? mLocManager.NETWORK_PROVIDER
                    : mLocManager.isProviderEnabled(mLocManager.GPS_PROVIDER) ? mLocManager.GPS_PROVIDER : null);
//                                : mLocManager.isProviderEnabled(mLocManager.PASSIVE_PROVIDER) ? mLocManager.PASSIVE_PROVIDER
            if(providerName != null){
                final Location loc = mLocManager.getLastKnownLocation(providerName);
                if(loc == null){
                    mLocManager.requestLocationUpdates(providerName,2000,100,mlocListener);
                }else{
                    activity.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(getApplicationContext(), "longitude " +loc.getLongitude()+" latitude "+loc.getLatitude(),Toast.LENGTH_LONG).show();
                            webViewKo.loadUrl("javascript:start.fetchCoords(" + loc.getLongitude() + "," + loc.getLatitude() + ")");
                        }
                        });
                }
            }else{
                Toast.makeText(getApplicationContext(), "Please Turn on Location Services", Toast.LENGTH_LONG).show();
                Intent myIntent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                startActivity(myIntent);
            }
        }
    }
    public  class MyLocationListener implements LocationListener {

        private Context applicationContext;

        @Override
        public void onLocationChanged(Location location) {
//            Log.d(TAG, "ngux location changed = "+location.getLongitude());
            webViewKo.loadUrl("javascript:index.fetchCoords(" + location.getLongitude() + "," + location.getLatitude() + ")");
        }

        @Override
        public void onStatusChanged(String provider, int status, Bundle extras) {

        }

        @Override
        public void onProviderEnabled(String provider) {
        }

        @Override
        public void onProviderDisabled(String provider) {
//            Toast.makeText(getApplicationContext(), "GPS DISABLED", Toast.LENGTH_SHORT).show();

        }
    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}

