package surepark.com.surepark;

import android.content.Context;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

/**
 * Created by fotokem on 7/31/15.
 */
public class JSInterface {
    Context mContext;
    public JSInterface(Context mContext){
        this.mContext = mContext;
    }
@JavascriptInterface
    public void showToast(){
    Toast.makeText(mContext, "Hello", Toast.LENGTH_LONG).show();
}
}
