<?php
namespace App;

use App\Repositories\PitchRepository;
use Illuminate\Database\Eloquent\Model;
use App\Pitch;
use Mail;
use Illuminate\Support\Facades\Config;
use App\Repositories\UserRepository;

class MailHandler {
	/**
	 * Send mail to user when state changed
	 *
	 * @param \App\Pitch $pitch
	 * @param $state_new
	 */
	static function sendStateChanged( Pitch $pitch, $state_new ) {
		//TODO check user settings

		$user      = UserRepository::getById( $pitch->user_id );
		$user_name = $user->first_name . " " . $user->last_name;
		$url       = Config::get( 'app.url_frontend' );

		$mail_text =
			"Hi {{user_name}},\n\n Your pitch \"{{pitch_title}}\" was updated to state \"{{state_new}}\".\n\n" .
			"Have a look at {{url}}/pitch/{{pitch_id}}\n\nYours,\nfax";

		$mail_text = str_replace(
			[
				"{{user_name}}",
				"{{pitch_title}}",
				"{{state_new}}",
				"{{url}}",
				"{{pitch_id}}"
			],
			[ $user->first_name, $pitch->title, $state_new, $url, $pitch->id ],
			$mail_text
		);

		Mail::raw( $mail_text, function ( $m ) use ( $user, $user_name ) {
			$m->to( $user->email, $user_name )->subject( 'Your pitch was updated' );
		} );
	}

	static function sendNewMessage( $pitch_id, $message ) {
		//TODO check user settings

		$pitch     = PitchRepository::getById( $pitch_id );
		$user      = UserRepository::getById( $pitch->user_id );
		$user_name = $user->first_name . " " . $user->last_name;
		$url       = Config::get( 'app.url_frontend' );

		$mail_text =
			"Hi {{user_name}},\n\n Your pitch \"{{pitch_title}}\" recived a new comment\".\n\n" .
			"Have a look at {{url}}/pitch/{{pitch_id}}\n\nYours,\nfax";

		$mail_text = str_replace(
			[ "{{user_name}}", "{{pitch_title}}", "{{url}}", "{{pitch_id}}" ],
			[ $user->first_name, $pitch->title, $url, $pitch->id ],
			$mail_text
		);

		Mail::raw( $mail_text, function ( $m ) use ( $user, $user_name ) {
			$m
				->to( $user->email, $user_name )
				->subject( 'New comment on your pitch' );
		} );
	}

	static function sendPasswordResetToken( $user, $token ) {
		$user_name = $user->first_name . ' ' . $user->last_name;
		$url       = Config::get( 'app.url_frontend' );

		$mail_text =
			"Hi {{user_name}},\n\n" .
			"You requested a new password.\n\n" .
			"You can reset your password here: {{url}}/reset-password?token={{token}}&email=" .
			urlencode( $user->email ) .
			"\n\n" .
			"This link will be valid for one hour.\n\n" .
			"Yours,\nfax";

		$mail_text = str_replace(
			[ "{{user_name}}", "{{url}}", "{{token}}" ],
			[ $user->first_name, $url, $token ],
			$mail_text
		);

		Mail::raw( $mail_text, function ( $m ) use ( $user, $user_name ) {
			$m->to( $user->email, $user_name )->subject( 'Password Reset' );
		} );
	}

	static function sendUserCreated( $user ) {
		$user_name = $user->first_name . ' ' . $user->last_name;
		$url       = Config::get( 'app.url_frontend' );

		$mail_text =
			"Hi {{user_name}},\n\nWelcome to fax!\n\n" .
			"Your account was created. Now you can set your password here: {{url}}/request-password\n\n" .
			"If you don't want to have an account, please send us an email. Please notice our privacy policy at {{url}}/privacy-policy.html\n\n" .
			"Yours,\nfax";

		$mail_text = str_replace(
			[ "{{user_name}}", "{{url}}" ],
			[ $user->first_name, $url ],
			$mail_text
		);

		Mail::raw( $mail_text, function ( $m ) use ( $user, $user_name ) {
			$m->to( $user->email, $user_name )->subject( 'Welcome to fax' );
		} );
	}
}
